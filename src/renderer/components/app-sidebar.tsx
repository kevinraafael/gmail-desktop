import { APP_SIDEBAR_WIDTH } from "../../lib/constants";
import { useAccounts, useGmailVisible, useSelectAccount } from "../lib/hooks";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export function AppSidebar() {
  const gmailVisible = useGmailVisible();
  const accounts = useAccounts();
  const selectAccount = useSelectAccount();

  if (!gmailVisible.data) {
    return;
  }

  if (accounts.data.length > 1) {
    return (
      <ScrollArea
        style={{ minWidth: APP_SIDEBAR_WIDTH }}
        className="border-r flex flex-col select-none"
      >
        <div className="flex flex-col items-center gap-4 flex-1 py-4 px-3">
          {accounts.data.map((account) => (
            <button
              key={account.id}
              type="button"
              className={cn(
                "size-10 border rounded-md inline-flex items-center justify-center font-light cursor-pointer",
                {
                  "bg-secondary": account.selected,
                }
              )}
              onClick={() => {
                selectAccount.mutate(account);
              }}
            >
              {account.label[0].toUpperCase()}
            </button>
          ))}
        </div>
      </ScrollArea>
    );
  }
}
