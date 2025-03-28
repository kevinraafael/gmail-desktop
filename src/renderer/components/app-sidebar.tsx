import { APP_SIDEBAR_WIDTH } from "../../lib/constants";
import { useAccounts, useIsSettingsOpen } from "../lib/hooks";
import { ipcMain } from "../lib/ipc";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export function AppSidebar() {
	const isSettingsOpen = useIsSettingsOpen();
	const accounts = useAccounts();

	if (isSettingsOpen.data || !accounts.data || accounts.data.length === 1) {
		return;
	}

	return (
		<ScrollArea
			style={{ minWidth: APP_SIDEBAR_WIDTH }}
			className="border-r flex flex-col select-none"
		>
			<div className="flex flex-col items-center gap-4 flex-1 py-4 px-3">
				{accounts.data.map((account) => {
					const renderIndicator = () => {
						if (account.gmail.state.attentionRequired) {
							return (
								<div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-2.5 h-2.5" />
							);
						}

						if (account.gmail.state.unreadCount) {
							return (
								<div className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full text-white w-4 h-4 flex items-center justify-center text-[0.5rem]">
									{account.gmail.state.unreadCount}
								</div>
							);
						}
					};

					return (
						<button
							key={account.config.id}
							type="button"
							className={cn(
								"size-10 border rounded-md flex items-center justify-center font-light cursor-pointer relative",
								{
									"bg-secondary": account.config.selected,
								},
							)}
							onClick={() => {
								ipcMain.send("selectAccount", account.config.id);
							}}
						>
							{account.config.label[0].toUpperCase()}
							{renderIndicator()}
						</button>
					);
				})}
			</div>
		</ScrollArea>
	);
}
