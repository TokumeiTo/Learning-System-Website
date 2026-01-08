import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        blur: string;
        toolbar?: string;
        gray?: string;
    }
    interface TypeText {
        tertiary: string;
    }
    interface PaletteOptions {
        background?: Partial<TypeBackground>;
        text?: Partial<TypeText>;
    }
}
