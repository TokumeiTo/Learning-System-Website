declare module 'react-player' {
    import { Component } from 'react';

    export interface ReactPlayerProps {
        url?: string | string[] | SourceProps[] | MediaStream;
        playing?: boolean;
        loop?: boolean;
        controls?: boolean;
        volume?: number;
        muted?: boolean;
        playbackRate?: number;
        width?: string | number;
        height?: string | number;
        style?: object;
        progressInterval?: number;
        playsinline?: boolean;
        pip?: boolean;
        stopOnUnmount?: boolean;
        light?: boolean | string;
        playIcon?: React.ReactElement;
        previewTabIndex?: number;
        fallback?: React.ReactElement;
        oembedConfig?: object;
        config?: any;
        onReady?: (player: any) => void;
        onStart?: () => void;
        onPlay?: () => void;
        onPause?: () => void;
        onBuffer?: () => void;
        onBufferEnd?: () => void;
        onSeek?: (seconds: number) => void;
        onPlaybackRateChange?: (speed: number) => void;
        onEnded?: () => void;
        onError?: (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => void;
        onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
        onDuration?: (duration: number) => void;
        onPlaybackQualityChange?: (quality: string) => void;
        onEnablePIP?: () => void;
        onDisablePIP?: () => void;
    }

    export default class ReactPlayer extends Component<ReactPlayerProps> {}
}

declare module 'react-player/lazy' {
    import ReactPlayer from 'react-player';
    export default ReactPlayer;
}