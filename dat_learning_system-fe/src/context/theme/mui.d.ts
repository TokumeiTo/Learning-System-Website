import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        blur: string;
        toolbar?: string;
    }
    interface TypeText {
        tertiary: string;
    }
    interface PaletteOptions {
        background?: Partial<TypeBackground>;
        text?: Partial<TypeText>;
    }
}
