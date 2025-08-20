import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export class MCPClient {
  private openai: OpenAI;
  private client: Client;
  private messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that can answer questions and help with tasks.",
    },
  ];
  private availableTools: any[] = [];
  private onToolCallStart: ((toolName: string, args: any) => void) | undefined;
  private onToolCallEnd: ((toolName: string, result: any) => void) | undefined;

  /**
   * Sets callbacks to be triggered when a tool call starts or ends.
   */
  setToolCallCallbacks(
    onStart: (toolName: string, args: any) => void,
    onEnd: (toolName: string, result: any) => void
  ) {
    this.onToolCallStart = onStart;
    this.onToolCallEnd = onEnd;
  }

  constructor() {
    this.openai = new OpenAI({
      apiKey: "sk-rtnpurmyyittjjucjmrzwhbjaxbrhkahhahjvfzpzvhlhpvs",
      baseURL: "http://localhost:11434/v1",
      dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用
    });
    this.client = new Client({
      name: "mcp-typescript-client",
      version: "1.0.0",
    });
    this.onToolCallStart = undefined;
    this.onToolCallEnd = undefined;
  }

  async connectToServer(serverScriptPath: string) {
    const isPython = serverScriptPath.endsWith(".py");
    const isJs = serverScriptPath.endsWith(".js");

    if (!isPython && !isJs) {
      throw new Error("Server script must be a .py or .js file");
    }

    const command = isPython ? "python" : "node";

    console.log("command", command, serverScriptPath);

    const transport = new StdioClientTransport({
      command,
      args: [serverScriptPath],
    });

    await this.client.connect(transport);

    // 获取并转换可用工具列表
    const tools = (await this.client.listTools()).tools as unknown as Tool[];
    this.availableTools = tools.map((tool) => ({
      type: "function" as const,
      function: {
        name: tool.name as string,
        description: tool.description as string,
        parameters: {
          type: "object",
          properties: tool.inputSchema.properties as Record<string, unknown>,
          required: tool.inputSchema.required as string[],
        },
      },
    }));

    console.log(
      "\nConnected to server with tools:",
      tools.map((tool) => tool.name)
    );
  }

  private async handleToolCalls(
    response: OpenAI.Chat.Completions.ChatCompletion,
    messages: ChatCompletionMessageParam[]
  ) {
    let currentResponse = response;
    let counter = 0; // 避免重复打印 AI 的响应消息
    const toolCallDetails: any[] = []; // 记录工具调用详情

    // 处理工具调用, 直到没有工具调用
    while (currentResponse.choices[0].message.tool_calls) {
      // 打印当前 AI 的响应消息
      if (currentResponse.choices[0].message.content && counter !== 0) {
        console.log("\n🤖 AI:", currentResponse.choices[0].message.content);
      }
      counter++;

      for (const toolCall of currentResponse.choices[0].message.tool_calls) {
        let toolName, toolArgs;
        if (toolCall.type === "function") {
          // 处理函数类型的tool_call
          toolName = toolCall.function.name;
          toolArgs = JSON.parse(toolCall.function.arguments);
        } else {
          // 处理自定义类型的tool_call（这里我们跳过处理）
          console.log(`\n⚠️  跳过自定义工具调用类型: ${toolCall.type}`);
          continue;
        }

        console.log(`\n🔧 调用工具 ${toolName}`);
        console.log(`📝 参数:`, JSON.stringify(toolArgs, null, 2));

        // 实时通知工具调用开始
        if (this.onToolCallStart) {
          this.onToolCallStart(toolName, toolArgs);
        }

        // 记录工具调用开始
        const toolCallStart = {
          type: "tool_call_start",
          toolName,
          arguments: toolArgs,
          timestamp: Date.now(),
        };
        toolCallDetails.push(toolCallStart);

        // 执行工具调用
        const result = await this.client.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        // 记录工具调用结果
        const toolCallEnd = {
          type: "tool_call_end",
          toolName,
          result: result.content,
          timestamp: Date.now(),
        };
        toolCallDetails.push(toolCallEnd);

        // 实时通知工具调用结束
        if (this.onToolCallEnd) {
          this.onToolCallEnd(toolName, result.content);
        }

        console.log(`✅ 工具 ${toolName} 调用成功`);
        console.log(`📦 结果:`, JSON.stringify(result.content, null, 2));
        // 添加 AI 的响应和工具调用结果到消息历史
        messages.push(currentResponse.choices[0].message);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result.content),
        } as ChatCompletionMessageParam);
      }

      // 获取下一个响应
      currentResponse = await this.openai.chat.completions.create({
        model: "qwen2.5:7b",
        messages: messages,
        tools: this.availableTools,
      });

      // 如果有内容，记录AI的思考过程
      if (currentResponse.choices[0].message.content) {
        toolCallDetails.push({
          type: "ai_thinking",
          content: currentResponse.choices[0].message.content,
          timestamp: Date.now(),
        });
      }
    }

    return { response: currentResponse, toolCallDetails };
  }

  async processQuery(
    query: string
  ): Promise<{ response: string; toolCallDetails?: any[] }> {
    // 添加用户查询到消息历史
    this.messages.push({
      role: "user",
      content: query,
    });
    // 初始 OpenAI API 调用
    let response = await this.openai.chat.completions.create({
      model: "qwen2.5:7b" as string,
      messages: this.messages,
      tools: this.availableTools,
    });
    console.log(response, "response");
    // 打印初始响应消息
    if (response.choices[0].message.content) {
      console.log("\n🤖 AI:", response.choices[0].message.content);
    }

    let toolCallDetails: any[] = [];

    // 如果有工具调用，处理它们
    if (response.choices[0].message.tool_calls) {
      const result = await this.handleToolCalls(response, this.messages);
      response = result.response;
      toolCallDetails = result.toolCallDetails;
    }

    // 将最终响应添加到消息历史
    this.messages.push(response.choices[0].message);

    return {
      response: response.choices[0].message.content || "",
      toolCallDetails,
    };
  }

  async cleanup() {
    if (this.client) {
      await this.client.close();
    }
  }
}
