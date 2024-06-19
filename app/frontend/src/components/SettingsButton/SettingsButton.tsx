import {Settings24Regular} from "@fluentui/react-icons";
import {Button} from "@fluentui/react-components";

import styles from "./SettingsButton.module.css";

interface Props {
  className?: string;
  onClick: () => void;
}

export const SettingsButton = ({className, onClick}: Props) => {
  // HACKATHON MANIA
  return <div style={{marginTop: "1rem"}}></div>;

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <Button icon={<Settings24Regular/>} onClick={onClick}>
        {"Kehittäjän työkalut"}
      </Button>
    </div>
  );
};
