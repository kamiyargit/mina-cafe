"use client";

import { useState, useEffect } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { resolveImageUrl } from "@/lib/api";

interface LiaraImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  fieldName?: string;
}

export function LiaraImageUpload({
  value,
  onChange,
}: LiaraImageUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (value && typeof value === "string" && (value.startsWith("http") || value.startsWith("/"))) {
      // If value is a URL (existing image), resolve it and show as preview
      const resolvedUrl = resolveImageUrl(value);
      setFileList([
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: resolvedUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleChange: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList } = info;

    // Generate preview URL for newly selected files
    const updatedFileList = newFileList.map((file) => {
      if (file.originFileObj && !file.url && !file.thumbUrl) {
        // Create a preview URL for the file
        const previewUrl = URL.createObjectURL(file.originFileObj);
        return {
          ...file,
          thumbUrl: previewUrl,
          status: "done" as const,
        };
      }
      return file;
    });

    setFileList(updatedFileList);

    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj;
      onChange?.(file || null);
    } else {
      onChange?.(null);
    }
  };

  const handleRemove = () => {
    // Clean up any object URLs we created
    fileList.forEach((file) => {
      if (file.thumbUrl && file.thumbUrl.startsWith("blob:")) {
        URL.revokeObjectURL(file.thumbUrl);
      }
    });
    setFileList([]);
    onChange?.(null);
  };

  return (
    <Upload
      beforeUpload={() => false}
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      listType="picture-card"
      maxCount={1}
      accept="image/*"
    >
      {fileList.length === 0 && (
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>انتخاب تصویر</div>
        </div>
      )}
    </Upload>
  );
}
