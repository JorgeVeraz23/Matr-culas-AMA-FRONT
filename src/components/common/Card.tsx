import React from "react";
import { Card as MUICard, CardContent, CardHeader, CardHeaderProps } from "@mui/material";

interface CardProps {
  title: string;
  subtitle?: string;
  action?: CardHeaderProps["action"];
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, action, children }) => {
  return (
    <MUICard
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`
      }}
    >
      <CardHeader
        title={title}
        subheader={subtitle}
        action={action}
        sx={{
          "& .MuiCardHeader-title": { fontSize: 18, fontWeight: 600 },
          "& .MuiCardHeader-subheader": { fontSize: 13 }
        }}
      />
      <CardContent>{children}</CardContent>
    </MUICard>
  );
};
