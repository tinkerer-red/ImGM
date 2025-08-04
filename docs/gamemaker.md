# GameMaker Layer

Scripts under gm/ expose ImGui components to GameMaker's runtime using static definitions and enums that map directly to the C++ bindings.

> This also applies for ImGui extensions (ImExts) that are included or you add yourself.

```mermaid
graph TD
    K[ImGui.gml] --> O[GameMaker Runtime]
    L[ImGui_Misc.gml] --> O
    M[ImExt<ExtensionName>.gml] --> O
    N[ImGui_Extras.gml] --> O
```
