# 点评嘉宾 Skill 预留目录

后续可为每位嘉宾在此目录下添加人设 skill 文件，用于深化 API 点评/对话时的角色贴合度。

建议命名：`{id}.md` 或 `{id}-persona.md`（如 `luyu.md`、`hulan-persona.md`）。

内容可包含：
- 该嘉宾的典型说话方式、口头禅、节奏
- 代表观点或价值观
- 经典梗、常说的金句
- 与李诞/其他嘉宾互动时的风格差异

代码中在调用 `buildCommentatorPrompt()` 或请求 API 前读取对应文件内容拼进 prompt 即可。
