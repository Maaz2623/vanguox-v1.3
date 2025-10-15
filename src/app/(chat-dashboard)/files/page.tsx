import { FilesView } from "@/modules/files/ui/views/files-view";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Files",
  description: "AI generated files",
};

const FilesPage = () => {
  return <FilesView />;
};

export default FilesPage;
