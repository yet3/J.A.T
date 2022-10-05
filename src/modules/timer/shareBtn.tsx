import { ControlBtn } from "@common/controlBtn";
import { TimerStep } from "@typings/timer";
import { TFunction } from "next-i18next";
import { useState } from "react";
import { makeStepsSavable } from "./makeStepsSavable.util";

interface Props {
  steps: TimerStep[]
  t: TFunction

  className?: string;
}

const TimerShareBtn = ({ steps, t, className }: Props) => {
  const [shareTimeout, setShareTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleShare = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    if (shareTimeout !== null) {
      clearTimeout(shareTimeout)
      setShareTimeout(null);
    }

    const url = new URL(window.location.href.split('?')[0])
    url.search = new URLSearchParams({ steps: JSON.stringify(makeStepsSavable(steps)) }).toString()
    navigator.clipboard.writeText(url.toString())

    setShareTimeout(setTimeout(() => {
      setShareTimeout(null)
    }, 1000))
  }

  return <ControlBtn className={className} onClick={handleShare} stage={shareTimeout ? 'copied' : 'share'} stages={{ share: { text: t('actions.share') }, copied: { text: t('actions.copied') } }} />
}

export { TimerShareBtn }
