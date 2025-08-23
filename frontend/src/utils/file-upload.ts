import axios from "axios";
import toast from "react-hot-toast";

export const uploadFileToS3 = async (file: File, sessionId: string) => {
  try {
    const fileName = file.name;
    console.log("Uploading file:", fileName);

    const response = await axios.post("/api/generate-presigned-url", {
      fileName: fileName,
      fileType: file.type,
      sessionId,
    });

    const { url, s3FileName } = response.data;

    console.log("Uploading to S3 with URL:", url);
    console.log("File type:", file.type);
    console.log("File size:", file.size);

    const s3Response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    console.log("S3 Response status:", s3Response.status);
    console.log("S3 Response headers:", s3Response.headers);

    if (s3Response.status === 200) {
      const baseUrl = process.env.NEXT_PUBLIC_AWS_BASE_URL;
      if (!baseUrl) {
        console.warn("NEXT_PUBLIC_AWS_BASE_URL not set, using fallback URL");
        return `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${s3FileName}`;
      }
      return `${baseUrl}/${s3FileName}`;
    } else {
      const errorText = await s3Response.text();
      console.error("S3 upload failed:", s3Response.status, errorText);
      throw new Error(
        `Failed to upload file to S3: ${s3Response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error uploading file: ", error);
    toast.error("Failed to upload file");
    throw error; // Re-throw the error so it can be handled by the caller
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
    } catch (error) {
      console.error("Failed to upload file:", file.name, error);
      // Continue with other files even if one fails
    }
  }
  return {
    urls,
    fileName: files[0].name,
  };
};
