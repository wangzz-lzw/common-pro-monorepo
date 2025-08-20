import {
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Bubble, Prompts, Welcome } from "@ant-design/x";
import { Button, Flex, Space, Spin } from "antd";
import { useMemo } from "react";
import { useStyle } from "../index.style";

const HOT_TOPICS = {
  key: "1",
  label: "Hot Topics",
  children: [
    {
      key: "1-1",
      description: "What has lzw upgraded?",
      icon: <span style={{ color: "#f93a4a", fontWeight: 700 }}>1</span>,
    },
    {
      key: "1-2",
      description: "New AGI Hybrid Interface",
      icon: <span style={{ color: "#ff6565", fontWeight: 700 }}>2</span>,
    },
    {
      key: "1-3",
      description: "What components are in lzw?",
      icon: <span style={{ color: "#ff8f1f", fontWeight: 700 }}>3</span>,
    },
    {
      key: "1-4",
      description: "Come and discover the new design paradigm of the AI era.",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>4</span>,
    },
    {
      key: "1-5",
      description: "How to quickly install and import components?",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: "2",
  label: "Design Guide",
  children: [
    {
      key: "2-1",
      icon: <HeartOutlined />,
      label: "Intention",
      description: "AI understands user needs and provides solutions.",
    },
    {
      key: "2-2",
      icon: <SmileOutlined />,
      label: "Role",
      description: "AI's public persona and image",
    },
    {
      key: "2-3",
      icon: <CommentOutlined />,
      label: "Chat",
      description: "How AI Can Express Itself in a Way Users Understand",
    },
    {
      key: "2-4",
      icon: <PaperClipOutlined />,
      label: "Interface",
      description: 'AI balances "chat" & "do" behaviors.',
    },
  ],
};

interface ChatListProps {
  messages: any[];
  onSubmit: (value: string) => void;
}

const ChatList = ({ messages, onSubmit }: ChatListProps) => {
  const { styles } = useStyle();

  const isEmpty = useMemo(() => !messages || messages.length === 0, [messages]);

  return (
    <div className={styles.chatList}>
      {!isEmpty ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={messages?.map((i: any) => ({
            ...i.message,
            classNames: {
              content: i.status === "loading" ? styles.loadingMessage : "",
            },
            typing:
              i.status === "loading"
                ? { step: 5, interval: 20, suffix: <>💗</> }
                : false,
          }))}
          style={{
            height: "100%",
            paddingInline: "calc(calc(100% - 700px) /2)",
          }}
          roles={{
            assistant: {
              placement: "start",
              footer: (
                <div style={{ display: "flex" }}>
                  <Button type="text" size="small" icon={<ReloadOutlined />} />
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} />
                  <Button type="text" size="small" icon={<DislikeOutlined />} />
                </div>
              ),
              loadingRender: () => <Spin size="small" />,
            },
            user: { placement: "end" },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          style={{ paddingInline: "calc(calc(100% - 700px) /2)" }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="Hello, I'm lzw"
            description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex gap={16} vertical>
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: "100%" },
                item: {
                  flex: 1,
                  backgroundImage:
                    "linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)",
                  borderRadius: 12,
                  border: "none",
                },
                subItem: { padding: 0, background: "transparent" },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description?.toString() || "");
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage:
                    "linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)",
                  borderRadius: 12,
                  border: "none",
                },
                subItem: { background: "#ffffffa6" },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description?.toString() || "");
              }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Space>
      )}
    </div>
  );
};
export default ChatList;
