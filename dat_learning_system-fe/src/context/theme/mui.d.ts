import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        blur: string;
        toolbar?: string;
    }
    interface PaletteOptions {
        background?: Partial<TypeBackground>;
    }
}
