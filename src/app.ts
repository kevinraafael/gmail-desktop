import { app } from "electron";
import { Main } from "./main";
import { Gmail } from "./gmail";
import { createIPCHandler } from "electron-trpc/main";
import { createIpcRouter } from "./lib/ipc";

app.whenReady().then(async () => {
	const main = await new Main().whenReady();

	const gmail = new Gmail({ main });

	createIPCHandler({
		router: createIpcRouter({ main, gmail }),
		windows: [main.window],
	});
});
