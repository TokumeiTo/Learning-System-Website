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
    // Allow palette to accept custom light/dark variations for semantic colors
    interface Palette {
        background: TypeBackground;
        text: TypeText;
    }
    interface PaletteOptions {
        background?: Partial<TypeBackground>;
        text?: Partial<TypeText>;
    }
}