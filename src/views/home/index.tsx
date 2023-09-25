import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import { TextArea, Modal, DotLoading, Toast } from "antd-mobile";
import icon from "@/assets/tx.png";
import { RightOutline } from "antd-mobile-icons";
interface promptType {
  content: string;
  role: string;
}
export default function Home() {
  const [message, setMessage] = useState<string>();
  const [value, setValue] = useState<string>();
  const [prompt, setPrompt] = useState<promptType[]>([]);
  const [getListLength, setListLength] = useState(0);
  const [needHttp, setNeedHttp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!needHttp) return;
    getMessageEvent();
  }, [prompt, needHttp]);
  const setPromptList = () => {
    if (!value) return;
    if (prompt.length > 0) {
      const data = prompt;
      data.push({
        content: value,
        role: "user",
      });
      setPrompt(data);
    } else {
      setPrompt([
        {
          content: value,
          role: "user",
        },
      ]);
    }
    setNeedHttp(true);
  };
  useEffect(() => {
    if (!message) return;
    prompt[getListLength] = {
      content: message as string,
      role: "assistant",
    };
    setPrompt(prompt);
  }, [message]);
  const getMessageEvent = () => {
    // const basePath = 'http://open.ai.wys168.cn';
    setLoading(true);
    fetch(`/api/open/v2/text`, {
      headers: {
        "Content-Type": "application/json",
        "ai-code": "Wys@Test",
      },
      method: "POST",
      body: JSON.stringify({
        prompt,
      }),
    })
      .then(async (resp) => {
        setValue("");
        setNeedHttp(false);

        const reader = resp.body?.getReader();
        const textDecoder = new TextDecoder();
        let newdata = "";
        setListLength(prompt.length);
        while (true) {
          if (!reader) return;
          const { done, value } = await reader.read();
          let str = textDecoder.decode(value);
          newdata += parseStreamData(str);
          setMessage(newdata);
          if (done) {
            setLoading(false);
            break;
          }
        }
      })
      .catch((error) => {
        Toast.show("请求失败，请刷新页面");
      });
  };
  // 自定义解析逻辑
  function parseStreamData(data: any) {
    const processedData = data.replace(/(\n|data:)/g, "");
    return processedData;
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.main}>
          {prompt.length > 0 &&
            prompt.map((item: promptType, index: number) => (
              <div
                key={index}
                className={style.item}
                style={{
                  backgroundColor: item.role == "user" ? "#ffffff" : "#dfd6c8",
                }}
              >
                <div className={style.itemWarp}>
                  {item.role !== "user" && <img src={icon} alt="" />}
                  <div className={style.text}>
                    {item.content}
                    {item.role !== "user" &&
                      loading &&
                      prompt.length - 1 === index && <DotLoading />}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className={style.bottom}>
          <div className={style.inputItem}>
            <div className={style.input}>
              <TextArea
                placeholder="请输入内容"
                autoSize={{ minRows: 1, maxRows: 5 }}
                value={value}
                onChange={(val) => {
                  setValue(val);
                }}
              />
            </div>
            <div className={style.btn} onClick={setPromptList}>
              <RightOutline color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
