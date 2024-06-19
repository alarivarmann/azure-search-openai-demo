import styles from "./Citation.module.css";
import {MockCitation} from "../../api";

interface Props {
  citation: MockCitation;
}

export const Citation = ({citation}: Props) => {
  return <div className={styles.citation}>
    <p className={styles.citationText}><span className={`highlight${citation.index}`}>{citation.relevantText}</span></p>

    <div className={styles.citationContext}>
      <span className={styles.citationDocumentName}>— {citation.documentName}</span>
      <span className={styles.citationDate}>{citation.date.toLocaleDateString('fi-FI')}</span>
    </div>
  </div>
}