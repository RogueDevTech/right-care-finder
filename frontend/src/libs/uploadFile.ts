import axios from "axios";
import toast from "react-hot-toast";

export const uploadFileToS3 = async (file: File, sessionId: string) => {
  try {
    const fileName = file.name;
    console.log(
      fileName,
      "fileNamefileNamefileNamefileNamefileNamefileNamefileName"
    );

    const response = await axios.post("/api/generate-presigned-url", {
      fileName: `${fileName}`,
      fileType: file.type,
      sessionId,
    });

    const { url, s3FileName } = response.data;

    const s3Response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (s3Response.status === 200) {
      return `${process.env.NEXT_PUBLIC_AWS_BASE_URL}/${s3FileName}`;
    } else {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    console.error("Error uploading file: ", error);
    toast.error("Failed to upload file");
    // throw error;
  }
};

export const uploadFiles = async (
  files: FileList,
  sessionId: string
): Promise<{ urls: string[]; fileName: string }> => {
  const urls: string[] = [];
  for (const file of Array.from(files)) {
    try {
      const url = await uploadFileToS3(file, sessionId);
      if (typeof url === "string" && url.startsWith("http")) {
        urls.push(url);
      }
    } catch {}
  }
  return {
    urls,
    fileName: files[0].name,
  };
};
