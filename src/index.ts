import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

interface ExtensionSettings {
  "edit-git-commit"?: {
    willCommit?: boolean
  }
}

function notifyCommit (willCommit: boolean, ctx: ExtensionContext) {
  if (willCommit) {
    ctx.ui.notify(`All changes will now be automatically commited.`, "info");
    return
  }
  ctx.ui.notify(`No changes will be automatically commited.`, "info");
}

export default function (pi: ExtensionAPI) {
  let willCommit = false;

  pi.on("session_start", async (_, ctx) => {
    const settings = pi.getSettings() as ExtensionSettings
    willCommit = settings["edit-git-commit"]?.willCommit ?? false;
    notifyCommit(willCommit, ctx);
  });

  pi.registerCommand("willCommit", {
		description: "Toggles the willCommit boolean. On true it will commit every change after a edit or write.",
		handler: async (_, ctx) => {
      willCommit = !willCommit;
      notifyCommit(willCommit, ctx);
		},
	});

  pi.on("tool_execution_end", async (event, ctx) => {
    if (willCommit && (event.toolName === "edit" || event.toolName === "write")) {
      const steps = [
        "git add .",
        `git ls-files --deleted -z | xargs -0 -r git rm --`,
        `git commit -m 'pi write'`,
      ];

      for (const cmd of steps) {
        const result = await pi.exec("bash", ["-lc", cmd]);
        if (result.code !== 0) {
          ctx.ui.notify(`Git step '${cmd}' failed: ${result.stderr}`, "warning");
          return;
        }
      }
    }
  });
}
