import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const MicToggle: React.FC = () => {
    const [micOn, setMicOn] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef<boolean>(false);
    const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastKnownMeetState = useRef<boolean | null>(null);

    const detectMeetMicState = (): boolean | null => {
        const micSpan = document.querySelector(".T0OZEe");
        if (!micSpan) return null;

        const micElement =
            micSpan.closest("button") || micSpan.closest("div[role='button']");
        if (!micElement) return null;

        const dataMuted = micElement.getAttribute("data-is-muted");
        if (dataMuted === "false") return true; // Mic is ON
        if (dataMuted === "true") return false; // Mic is OFF/muted

        const ariaLabel = micElement.getAttribute("aria-label")?.toLowerCase();
        if (ariaLabel?.includes("turn off")) {
            return true;
        }
        if (ariaLabel?.includes("turn on")) {
            return false;
        }

        return null;
    };

    const syncWithMeet = () => {
        const meetState = detectMeetMicState();
        if (meetState !== null && meetState !== lastKnownMeetState.current) {
            console.log("Google Meet mic state changed:", meetState);
            lastKnownMeetState.current = meetState;
            setMicOn(meetState);
        }
    };

    const toggleMic = () => {
        const micSpan = document.querySelector(".T0OZEe") as HTMLElement | null;
        if (micSpan) {
            micSpan.click();

            const newState = !micOn;
            setMicOn(newState);
            lastKnownMeetState.current = newState;
            return;
        }

        const micElement =
            document.querySelector(".T0OZEe")?.closest("button") ||
            document.querySelector(".T0OZEe")?.closest("div[role='button']");
        if (micElement) {
            (micElement as HTMLElement).click();

            const newState = !micOn;
            setMicOn(newState);
            lastKnownMeetState.current = newState;
        } else {
            console.warn("Mic button/div not found");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            const initialState = detectMeetMicState();
            if (initialState !== null) {
                setMicOn(initialState);
                lastKnownMeetState.current = initialState;
            }
        }, 1000);

        const observer = new MutationObserver(() => {
            syncWithMeet();
        });

        const micSpan = document.querySelector(".T0OZEe");
        const micElement =
            micSpan?.closest("button") ||
            micSpan?.closest("div[role='button']");
        if (micElement) {
            observer.observe(micElement, {
                attributes: true,
                attributeFilter: ["aria-label", "data-is-muted"],
            });
        }

        const controlsContainer =
            document.querySelector("[data-test-id='controls-container']") ||
            document.querySelector(".crqnQb") ||
            document.body;

        observer.observe(controlsContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                "aria-pressed",
                "aria-label",
                "class",
                "data-is-muted",
            ],
        });

        const syncInterval = setInterval(() => {
            syncWithMeet();
        }, 2000);

        return () => {
            observer.disconnect();
            clearInterval(syncInterval);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const savedX = localStorage.getItem("mic-x");
        const savedY = localStorage.getItem("mic-y");
        if (savedX && savedY) {
            container.style.left = `${savedX}px`;
            container.style.top = `${savedY}px`;
        }

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            offset.current = {
                x: e.clientX - container.getBoundingClientRect().left,
                y: e.clientY - container.getBoundingClientRect().top,
            };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            container.style.left = `${e.clientX - offset.current.x}px`;
            container.style.top = `${e.clientY - offset.current.y}px`;
        };

        const handleMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            const rect = container.getBoundingClientRect();
            localStorage.setItem("mic-x", `${rect.left}`);
            localStorage.setItem("mic-y", `${rect.top}`);
        };

        container.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div
            id="mic-container"
            ref={containerRef}
            style={{ position: "fixed", top: "80%", left: "85%" }}
        >
            <button
                id="mic-toggle"
                className={micOn ? "on" : "off"}
                title={micOn ? "Click to mute mic" : "Click to unmute mic"}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMic();
                }}
            >
                🎤
            </button>
        </div>
    );
};

const mountNode = document.createElement("div");
document.body.appendChild(mountNode);
ReactDOM.createRoot(mountNode).render(<MicToggle />);
