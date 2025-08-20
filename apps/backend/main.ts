import express from "express";
import cors from "cors";
import { MCPClient } from "@common-pro/share";
let mcpClient: MCPClient | null = null;
let isConnecting = false;
const port = 3000;
async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.post("/agent", async (req, res) => {
    const { body } = req;
    const { message } = body;
    console.log(message, "message");

    // 如果需要连接MCP服务
    if (!mcpClient && !isConnecting) {
      isConnecting = true;
      try {
        mcpClient = new MCPClient();
        const serverScriptPath =
          "/home/wangzz/下载/myproject/next-mcp-client/src/opendia-mcp/server.js";
        await mcpClient.connectToServer(serverScriptPath);
        isConnecting = false;
        return res.send({
          success: true,
          message: "MCP服务连接成功",
          connecting: false,
        });
      } catch (error) {
        isConnecting = false;
        return res.send({
          success: false,
          error: error instanceof Error ? error.message : "连接MCP服务失败",
          connecting: false,
        });
      }
    }
    if (mcpClient && message) {
      try {
        // 非流式响应处理
        const result = await mcpClient.processQuery(message);
        console.log(result, "result");
        return res.send({
          success: true,
          response: result.response,
          toolCallDetails: result.toolCallDetails,
        });
      } catch (error) {
        return res.send({
          success: false,
          error: error instanceof Error ? error.message : "处理消息时出错",
        });
      }
    }
    // 检查是否已经连接
    if (mcpClient) {
      return res.send({
        success: true,
        message: "MCP客户端已就绪",
        connected: true,
      });
    }

    // 默认响应（未连接状态）
    return res.send({
      success: true,
      message: "MCP客户端未连接",
    });
  });
  app.listen(port, () => {
    console.log(`MCP服务已启动，端口：${port}`);
  });
}

bootstrap();
