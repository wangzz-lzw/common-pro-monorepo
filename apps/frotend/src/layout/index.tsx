import { useEffect, useRef, useState } from "react";
import { useStyle } from "./index.style";
import ChatSider from "./chatSider";
import ChatList from "./chatList";
import ChatSender from "./chatSender";
import { useXAgent, useXChat } from "@ant-design/x";
import { postAgent } from "../api/modules/agent";
type BubbleDataType = {
  role: string;
  content: string;
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: "default-0",
    label: "What is Ant Design X?",
    group: "Today",
  },
  {
    key: "default-1",
    label: "How to quickly install and import components?",
    group: "Today",
  },
  {
    key: "default-2",
    label: "New AGI Hybrid Interface",
    group: "Yesterday",
  },
];

export const Layout = () => {
  const { styles } = useStyle();
  const abortController = useRef<AbortController>(null);

  // ==================== State ====================
  const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});

  const [conversations, setConversations] = useState(
    DEFAULT_CONVERSATIONS_ITEMS
  );
  const [curConversation, setCurConversation] = useState(
    DEFAULT_CONVERSATIONS_ITEMS[0].key
  );
  const customRequest = async (msg, callbacks) => {
    let finalResult;
    const params = {
      message: msg.message.content,
    };
    const data = await postAgent<{
      type: any;
      message: string;
      toolName: string;
      arguments: any;
      result: string;
    }>(params);
    console.log(data, "data");
    if (!data.type) {
      finalResult = data;
      callbacks.onSuccess([finalResult]);
      return;
    }
    switch (data.type) {
      case "tool_call_start":
        // 创建工具调用开始消息
        const startMessage = {
          id: `tool-start-${data.toolName}-${Date.now()}`,
          data: {
            type: "tool_call_start",
            toolName: data.toolName,
            arguments: data.arguments,
          },
          toolGroup: false,
          sender: "system",
          isTyping: false,
        };

        console.log("发送工具调用开始消息:", startMessage);
        callbacks.onSuccess([startMessage]);
        break;

      case "tool_call_end":
        // 创建工具调用结束消息
        const endMessage = {
          id: `tool-end-${data.toolName}-${Date.now()}`,
          data: {
            type: "tool_call_end",
            toolName: data.toolName,
            result: data.result,
          },
          toolGroup: false,
          sender: "system",
          isTyping: false,
        };

        console.log("发送工具调用结束消息:", endMessage);
        callbacks.onSuccess([endMessage]);
        break;

      case "final_result":
        finalResult = data;
        console.log("收到最终结果:", data);

        // 立即发送最终结果
        if (finalResult) {
          // 更新缓冲区中的工具调用详情

          // 发送最终结果
          const finalMessage = {
            id: `final-${Date.now()}`,
            data: finalResult.response,
            sender: "assistant",
            isTyping: true,
          };

          console.log("发送最终结果消息:", finalMessage);
          callbacks.onSuccess([finalMessage]);
        }
        break;

      case "error":
        console.error("流式传输错误:", data.message);
        throw new Error(data.message);
    }
  };
  // ==================== Runtime ====================
  const [agent] = useXAgent<BubbleDataType>({
    // baseURL: "https://api.x.ant.design/api/llm_siliconflow_deepseekr1",
    // model: "deepseek-ai/DeepSeek-R1",
    // dangerouslyApiKey: "Bearer sk-xxxxxxxxxxxxxxxxxxxx",
    request: customRequest,
  });
  const loading = agent.isRequesting();

  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant",
        };
      }
      return {
        content: "Request failed, please try again!",
        role: "assistant",
      };
    },
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {};
      let currentContent = "";
      let currentThink = "";
      try {
        if (chunk?.data && !chunk?.data.includes("DONE")) {
          const message = JSON.parse(chunk?.data);
          currentThink = message?.choices?.[0]?.delta?.reasoning_content || "";
          currentContent = message?.choices?.[0]?.delta?.content || "";
        }
      } catch (error) {
        console.error(error);
      }

      let content = "";

      if (!originMessage?.content && currentThink) {
        content = `<tool_call>${currentThink}`;
      } else if (
        originMessage?.content?.includes("<tool_call>") &&
        !originMessage?.content.includes("</tool_call>")
      ) {
        content = `${originMessage.content}${currentThink}`;
      } else if (
        originMessage?.content?.includes("<tool_call>") &&
        originMessage?.content.includes("</tool_call>")
      ) {
        content = `${originMessage.content}${currentContent}`;
      } else {
        content = `${currentContent}`;
      }

      return {
        ...originMessage,
        content,
      };
    },
  });

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;

    if (loading) {
      // message.error 可以在 ChatSender 组件中处理
      return;
    }

    onRequest({
      stream: true,
      message: { role: "user", content: val },
    });
  };

  useEffect(() => {
    // history mock
    if (messages?.length) {
      setMessageHistory((prev) => ({
        ...prev,
        [curConversation]: messages,
      }));
    }
  }, [messages]);

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <ChatSider
        conversations={conversations}
        setConversations={setConversations}
        curConversation={curConversation}
        setCurConversation={setCurConversation}
        messageHistory={messageHistory}
        setMessages={setMessages}
        abortController={abortController}
      />

      <div className={styles.chat}>
        <ChatList messages={messages} onSubmit={onSubmit} />
        <ChatSender
          loading={loading}
          onRequest={onRequest}
          abortController={abortController}
        />
      </div>
    </div>
  );
};
export default Layout;
