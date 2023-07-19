import Image from 'next/image';
import Play from "$/assets/icons/play-slate-400.svg";
import Pause from "$/assets/icons/pause-slate-400.svg";
import Stop from "$/assets/icons/stop-slate-400.svg";
import { useState } from 'react';

type Props = {
    className?: string
    play : () => boolean
    pause : () => boolean
    stop : () => boolean
}

export function TimeController({className,play,pause,stop}:Props) {
    const [is_playing,setPlaying] = useState(false)

    return (
        <div className={className + "align-middle flex"}>
        {
            is_playing ? 
            <Image 
                priority
                src={Pause}
                className={`w-8 h-8 inline-block`}
                alt="pause"
                onClick={() => {
                    if(pause()){
                        setPlaying(false)
                    }
                }}
            />
            :
            <Image 
                priority
                src={Play}
                className={`w-8 h-8 inline-block`}
                alt="play"
                onClick={() => {
                    if(play()) {
                        setPlaying(true)
                    }
                }}
            />
        }
        <Image 
            priority
            src={Stop}
            className={`w-8 h-8 block`}
            alt="stop"
            onClick={() => {
                if(stop()) {
                    setPlaying(false)
                }
            }}
        />
    </div>
    )
}