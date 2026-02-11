import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        blur: string;
        toolbar: string;
        gray: string;
        gradient: string;
    }
    interface TypeText {
        tertiary: string;
        disabled: string;
    }
    // Extend Palette to include our custom types
    interface Palette {
        background: TypeBackground;
        text: TypeText;
    }
    interface PaletteOptions {
        background?: Partial<TypeBackground>;
        text?: Partial<TypeText>;
    }
}