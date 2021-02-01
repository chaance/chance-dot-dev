import * as React from "react";

const EMPTY_AUDIO =
	"data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export function useAudio(src: string): UseAudioValue {
	const audio = React.useRef<HTMLAudioElement | undefined>();
	const resetAudio = React.useCallback((src: string) => {
		if (audio.current) {
			// Clears previous audio if it is playing and the source hasn't changed so
			// we can use the same audio object.
			if (audio.current.getAttribute("src") === src) {
				audio.current.setAttribute("src", EMPTY_AUDIO);
			}
			audio.current.setAttribute("src", src);
		}
	}, []);

	React.useEffect(() => {
		if (!("Audio" in window)) {
			return;
		}

		if (audio.current === undefined) {
			audio.current = new Audio(src);
		} else {
			resetAudio(src);
		}
	}, [resetAudio, src]);

	return React.useMemo(
		() => ({
			resetAudio() {
				resetAudio(src);
			},
			pause() {
				audio.current?.pause();
			},
			play({ interrupt } = {}) {
				if (interrupt) {
					if (!this.paused) {
						this.resetAudio();
					}
				}
				audio.current?.play();
			},
			get audio() {
				return audio.current;
			},
			get paused() {
				return audio.current?.paused || false;
			},
		}),
		[src, resetAudio]
	);
}

interface UseAudioValue {
	resetAudio(): void;
	pause(): void;
	play(options?: { interrupt?: boolean }): void;
	readonly audio: HTMLAudioElement | undefined;
	readonly paused: boolean;
}
