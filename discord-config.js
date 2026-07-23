// Config Discord — webhook + mapping Poule -> thread/role.
// (Reprend les valeurs de ton script envoi.js.)

export const WEBHOOK_URL = "https://discord.com/api/webhooks/1529652541120450651/gWfTqeqOq9WdN1KESOPGPIZcJFcJvwDh6uvyy7om-BTLmSdOaJVsheig4vHypwFM14_D";

// Clé = lettre de poule (A-H), pas "Poule A", pour matcher directement m.poule.
export const POULE_DISCORD = {
  A: { threadId: "1529165298798821447", roleId: "1529650327777710120" },
  B: { threadId: "1529168172895174666", roleId: "1529650431087743116" },
  C: { threadId: "1529168534645506228", roleId: "1529650467725119518" },
  D: { threadId: "1529168897985745119", roleId: "1529650507096789012" },
  E: { threadId: "1529169470571020508", roleId: "1529650535865520138" },
  F: { threadId: "1529169629413642472", roleId: "1529650568770093199" },
  G: { threadId: "1529169873983246606", roleId: "1529650596561293534" },
  H: { threadId: "1529170031898792161", roleId: "1529650623581130752" },
};
