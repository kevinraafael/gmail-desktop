import {
	ArrowLeftIcon,
	ArrowRightIcon,
	EllipsisVerticalIcon,
	RotateCwIcon,
	SettingsIcon,
} from "lucide-react";
import type { HTMLAttributes } from "react";
import { APP_SIDEBAR_WIDTH, APP_TITLEBAR_HEIGHT } from "../../lib/constants";
import {
	useIsSettingsOpen,
	useIsWindowMaximized,
	useSelectedAccount,
} from "../lib/hooks";
import { ipcMain } from "../lib/ipc";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from "./ui/icons";

function WindowControlButton({
	className,
	...props
}: HTMLAttributes<HTMLButtonElement>) {
	return (
		<Button
			variant="ghost"
			className={cn("rounded-none", className)}
			style={{ width: APP_TITLEBAR_HEIGHT, height: APP_TITLEBAR_HEIGHT }}
			{...props}
		/>
	);
}

function WindowControls() {
	const isWindowMaximized = useIsWindowMaximized();

	return (
		<div
			className="flex"
			// @ts-expect-error
			style={{ appRegion: "none" }}
		>
			<WindowControlButton
				onClick={() => ipcMain.send("controlWindow", "minimize")}
			>
				<MinimizeIcon />
			</WindowControlButton>
			<WindowControlButton
				onClick={() =>
					ipcMain.send(
						"controlWindow",
						isWindowMaximized.data ? "unmaximize" : "maximize",
					)
				}
			>
				{isWindowMaximized.data ? <RestoreIcon /> : <MaximizeIcon />}
			</WindowControlButton>
			<WindowControlButton
				className="hover:bg-destructive/90"
				onClick={() => ipcMain.send("controlWindow", "close")}
			>
				<CloseIcon />
			</WindowControlButton>
		</div>
	);
}

function TitlebarTitle() {
	const selectedAccount = useSelectedAccount();

	const isSettingsOpen = useIsSettingsOpen();

	return (
		<div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground pointer-events-none">
			{isSettingsOpen.data || !selectedAccount
				? "Settings"
				: selectedAccount.gmail.state.title}
		</div>
	);
}

function TitlebarNavigation() {
	const selectedAccount = useSelectedAccount();

	const isSettingsOpen = useIsSettingsOpen();

	return (
		<div
			className={cn("flex items-center gap-1", {
				invisible: isSettingsOpen.data,
			})}
			style={{
				// @ts-expect-error
				appRegion: "none",
				marginLeft:
					window.electron.process.platform === "darwin"
						? APP_SIDEBAR_WIDTH
						: undefined,
			}}
		>
			<Button
				variant="ghost"
				size="icon"
				className="size-7"
				onClick={() => {
					ipcMain.send("goNavigationHistory", "back");
				}}
				disabled={!selectedAccount?.gmail.state.navigationHistory.canGoBack}
			>
				<ArrowLeftIcon />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="size-7"
				onClick={() => {
					ipcMain.send("goNavigationHistory", "forward");
				}}
				disabled={!selectedAccount?.gmail.state.navigationHistory.canGoForward}
			>
				<ArrowRightIcon />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="size-7"
				onClick={() => {
					ipcMain.send("reloadGmail");
				}}
			>
				<RotateCwIcon />
			</Button>
		</div>
	);
}

export function AppTitlebar() {
	return (
		<div
			style={{
				minHeight: APP_TITLEBAR_HEIGHT,
				// @ts-expect-error
				appRegion: "drag",
			}}
			className="flex border-b select-none relative"
		>
			<TitlebarTitle />
			<div
				className={cn(
					"flex-1 flex justify-between",
					window.electron.process.platform === "darwin" ? "px-2" : "px-3",
				)}
			>
				<TitlebarNavigation />
				<div
					className="flex items-center gap-1"
					// @ts-expect-error
					style={{ appRegion: "none" }}
				>
					<Button
						variant="ghost"
						size="icon"
						className="size-7"
						onClick={() => {
							ipcMain.send("toggleIsSettingsOpen");
						}}
					>
						<SettingsIcon />
					</Button>
					{window.electron.process.platform !== "darwin" && (
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
							onClick={() => {
								ipcMain.send("toggleAppMenu");
							}}
						>
							<EllipsisVerticalIcon />
						</Button>
					)}
				</div>
			</div>
			{window.electron.process.platform !== "darwin" && <WindowControls />}
		</div>
	);
}
