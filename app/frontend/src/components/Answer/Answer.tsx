import {useMemo} from "react";
import {Stack, IconButton} from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";
import {ChatAppResponse, getCitationFilePath} from "../../api";
import {parseAnswerToHtml} from "./AnswerParser";
import {AnswerIcon} from "./AnswerIcon";
import {SpeechOutputBrowser} from "./SpeechOutputBrowser";
import {SpeechOutputAzure} from "./SpeechOutputAzure";

interface Props {
  answer: ChatAppResponse;
  isSelected?: boolean;
  isStreaming: boolean;
  onCitationClicked: (filePath: string) => void;
  onThoughtProcessClicked: () => void;
  onSupportingContentClicked: () => void;
  onFollowupQuestionClicked?: (question: string) => void;
  showFollowupQuestions?: boolean;
  showSpeechOutputBrowser?: boolean;
  showSpeechOutputAzure?: boolean;
  speechUrl: string | null;
}

export const Answer = ({
                         answer,
                         isSelected,
                         isStreaming,
                         onCitationClicked,
                         onThoughtProcessClicked,
                         onSupportingContentClicked,
                         onFollowupQuestionClicked,
                         showFollowupQuestions,
                         showSpeechOutputAzure,
                         showSpeechOutputBrowser,
                         speechUrl
                       }: Props) => {
  const followupQuestions = answer.context?.followup_questions;
  const messageContent = answer.message.content;
  const parsedAnswer = useMemo(() => parseAnswerToHtml(messageContent, isStreaming, onCitationClicked), [answer]);

  const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);

  const answerWithMockCitationsHighlighted = parsedAnswer.answerHtml
    .replace(/<1>(.*?)<\/1>/g, '<span class="highlight1">$1</span>')
    .replace(/<2>(.*?)<\/2>/g, '<span class="highlight2">$1</span>')
    .replace(/<3>(.*?)<\/3>/g, '<span class="highlight3">$1</span>')
    .replace(/<4>(.*?)<\/4>/g, '<span class="highlight4">$1</span>')
    .replace(/<5>(.*?)<\/5>/g, '<span class="highlight5">$1</span>')
    .replace(/<6>(.*?)<\/6>/g, '<span class="highlight6">$1</span>')
    .replace(/<7>(.*?)<\/7>/g, '<span class="highlight7">$1</span>')
    .replace(/<8>(.*?)<\/8>/g, '<span class="highlight8">$1</span>')
    .replace(/<9>(.*?)<\/9>/g, '<span class="highlight9">$1</span>')
    .replace(/<10>(.*?)<\/10>/g, '<span class="highlight10">$1</span>')
    .replace(/<11>(.*?)<\/11>/g, '<span class="highlight11">$1</span>')
    .replace(/<12>(.*?)<\/12>/g, '<span class="highlight12">$1</span>')
    .replace(/<13>(.*?)<\/13>/g, '<span class="highlight13">$1</span>')
    .replace(/<14>(.*?)<\/14>/g, '<span class="highlight14">$1</span>')
    .replace(/<15>(.*?)<\/15>/g, '<span class="highlight15">$1</span>')
    .replace(/<16>(.*?)<\/16>/g, '<span class="highlight16">$1</span>')
    .replace(/<17>(.*?)<\/17>/g, '<span class="highlight17">$1</span>')
    .replace(/<18>(.*?)<\/18>/g, '<span class="highlight18">$1</span>');


  return (
    <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between">
          <AnswerIcon/>
          {/*<div>*/}
          {/*  <IconButton*/}
          {/*    style={{color: "black"}}*/}
          {/*    iconProps={{iconName: "Lightbulb"}}*/}
          {/*    title="Show thought process"*/}
          {/*    ariaLabel="Show thought process"*/}
          {/*    onClick={() => onThoughtProcessClicked()}*/}
          {/*    disabled={!answer.context.thoughts?.length}*/}
          {/*  />*/}
          {/*  <IconButton*/}
          {/*    style={{color: "black"}}*/}
          {/*    iconProps={{iconName: "ClipboardList"}}*/}
          {/*    title="Show supporting content"*/}
          {/*    ariaLabel="Show supporting content"*/}
          {/*    onClick={() => onSupportingContentClicked()}*/}
          {/*    disabled={!answer.context.data_points}*/}
          {/*  />*/}
          {/*  {showSpeechOutputAzure && <SpeechOutputAzure url={speechUrl}/>}*/}
          {/*  {showSpeechOutputBrowser && <SpeechOutputBrowser answer={sanitizedAnswerHtml}/>}*/}
          {/*</div>*/}
        </Stack>
      </Stack.Item>

      <Stack.Item grow>
        <div className={styles.answerText} dangerouslySetInnerHTML={{__html: answerWithMockCitationsHighlighted}}></div>
      </Stack.Item>

      {!!parsedAnswer.citations.length && (
        <Stack.Item>
          <Stack horizontal wrap tokens={{childrenGap: 5}}>
            <span className={styles.citationLearnMore}>Citations:</span>
            {parsedAnswer.citations.map((x, i) => {
              const path = getCitationFilePath(x);
              return (
                <a key={i} className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                  {`${++i}. ${x}`}
                </a>
              );
            })}
          </Stack>
        </Stack.Item>
      )}

      {!!followupQuestions?.length && showFollowupQuestions && onFollowupQuestionClicked && (
        <Stack.Item>
          <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`}
                 tokens={{childrenGap: 6}}>
            <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
            {followupQuestions.map((x, i) => {
              return (
                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                  {`${x}`}
                </a>
              );
            })}
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  );
};
