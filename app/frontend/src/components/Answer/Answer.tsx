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
    .replace(/<7>(.*?)<\/7>/g, '<span class="highlight7">$1</span>');

  return (
    <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between">
          <AnswerIcon/>
          <div>
            <IconButton
              style={{color: "black"}}
              iconProps={{iconName: "Lightbulb"}}
              title="Show thought process"
              ariaLabel="Show thought process"
              onClick={() => onThoughtProcessClicked()}
              disabled={!answer.context.thoughts?.length}
            />
            <IconButton
              style={{color: "black"}}
              iconProps={{iconName: "ClipboardList"}}
              title="Show supporting content"
              ariaLabel="Show supporting content"
              onClick={() => onSupportingContentClicked()}
              disabled={!answer.context.data_points}
            />
            {showSpeechOutputAzure && <SpeechOutputAzure url={speechUrl}/>}
            {showSpeechOutputBrowser && <SpeechOutputBrowser answer={sanitizedAnswerHtml}/>}
          </div>
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
