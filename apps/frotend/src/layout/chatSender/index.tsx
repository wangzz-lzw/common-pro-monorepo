import { useState } from "react";
import { Prompts, Sender } from "@ant-design/x";
import { SENDER_PROMPTS } from "./contants";
import { useStyle } from "../index.style";
import SenderHeader from "./senderHeader";
import { Button, Flex, message } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";

interface ChatSenderProps {
  loading: boolean;
  onRequest: (params: { stream: boolean; message: { role: string; content: string } }) => void;
  abortController: React.MutableRefObject<AbortController | null>;
}

const ChatSender = ({ loading, onRequest, abortController }: ChatSenderProps) => {
  const { styles } = useStyle();
  const [inputValue, setInputValue] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  
  const onSubmit = (val: string) => {
    if (!val) return;

    if (loading) {
      message.error(
        "Request is in progress, please wait for the request to complete."
      );
      return;
    }

    onRequest({
      stream: true,
      message: { role: "user", content: val },
    });
  };

  return (
    <>
      {/* 🌟 提示词 */}
      <Prompts
        items={SENDER_PROMPTS}
        onItemClick={(info) => {
          onSubmit(info.data.description as string);
        }}
        styles={{
          item: { padding: "6px 12px" },
        }}
        className={styles.senderPrompt}
      />
      {/* 🌟 输入框 */}
      <Sender
        value={inputValue}
        header={<SenderHeader attachmentsOpen={attachmentsOpen} setAttachmentsOpen={setAttachmentsOpen} />}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue("");
        }}
        onChange={setInputValue}
        onCancel={() => {
          abortController.current?.abort();
        }}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
        loading={loading}
        className={styles.sender}
        allowSpeech
        actions={(_, info) => {
          const { SendButton, LoadingButton, SpeechButton } = info.components;
          return (
            <Flex gap={4}>
              <SpeechButton className={styles.speechButton} />
              {loading ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" />
              )}
            </Flex>
          );
        }}
        placeholder="Ask or input / use skills"
      />
    </>
  );
};
export default ChatSender;