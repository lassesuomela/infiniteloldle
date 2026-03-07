import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "react-toastify";
import { handleResponseError } from "./axiosInterceptor";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("handleResponseError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a rate-limit toast on 429 response", async () => {
    const error = { response: { status: 429 } };
    await handleResponseError(error).catch(() => {});
    expect(toast.error).toHaveBeenCalledWith(
      "Too many requests. Please wait a moment before trying again.",
      expect.objectContaining({ toastId: "rate-limit-error" })
    );
  });

  it("does not show a toast for non-429 errors", async () => {
    const error = { response: { status: 500 } };
    await handleResponseError(error).catch(() => {});
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("rejects the promise with the original error", async () => {
    const error = { response: { status: 429 } };
    await expect(handleResponseError(error)).rejects.toEqual(error);
  });

  it("does not show a toast when there is no response object", async () => {
    const error = new Error("Network Error");
    await handleResponseError(error).catch(() => {});
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("uses a stable toastId to prevent duplicate notifications", async () => {
    const error = { response: { status: 429 } };
    await handleResponseError(error).catch(() => {});
    expect(toast.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ toastId: "rate-limit-error" })
    );
  });
});
