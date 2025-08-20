import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import { Avatar, Button } from "antd";
import dayjs from "dayjs";
import { useStyle } from "../index.style";
import { DEFAULT_CONVERSATIONS_ITEMS } from "./contants";

interface ChatSiderProps {
  conversations: typeof DEFAULT_CONVERSATIONS_ITEMS;
  setConversations: React.Dispatch<
    React.SetStateAction<typeof DEFAULT_CONVERSATIONS_ITEMS>
  >;
  curConversation: string;
  setCurConversation: React.Dispatch<React.SetStateAction<string>>;
  messageHistory: Record<string, any>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  abortController: React.MutableRefObject<AbortController | null>;
}

function ChatSider({
  conversations,
  setConversations,
  curConversation,
  setCurConversation,
  messageHistory,
  setMessages,
  abortController,
}: ChatSiderProps) {
  const { styles } = useStyle();

  return (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>lzw</span>
      </div>

      {/* 🌟 添加会话 */}
      <Button
        onClick={() => {
          const now = dayjs().valueOf().toString();
          setConversations([
            {
              key: now,
              label: `New Conversation ${conversations.length + 1}`,
              group: "Today",
            },
            ...conversations,
          ]);
          setCurConversation(now);
          setMessages([]);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        New Conversation
      </Button>

      {/* 🌟 会话管理 */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={async (val) => {
          abortController.current?.abort();
          // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
          // In future versions, the sessionId capability will be added to resolve this problem.
          setTimeout(() => {
            setCurConversation(val);
            setMessages(messageHistory?.[val] || []);
          }, 100);
        }}
        groupable
        styles={{ item: { padding: "0 8px" } }}
        menu={(conversation) => ({
          items: [
            {
              label: "Rename",
              key: "rename",
              icon: <EditOutlined />,
            },
            {
              label: "Delete",
              key: "delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter(
                  (item) => item.key !== conversation.key
                );
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                // This feature will be fixed in a future version.
                setTimeout(() => {
                  if (conversation.key === curConversation) {
                    setCurConversation(newKey);
                    setMessages(messageHistory?.[newKey] || []);
                  }
                }, 200);
              },
            },
          ],
        })}
      />

      <div className={styles.siderFooter}>
        <Avatar size={24} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );
}

export default ChatSider;
