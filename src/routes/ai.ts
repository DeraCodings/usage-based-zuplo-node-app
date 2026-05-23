import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { createStreamResponse } from "../services/openrouter.js";

interface SummarizeBody {
  text: string;
}

interface RewriteBody {
  text: string;
  tone?: string;
}

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// The /summarize endpoint accepts a POST request with a JSON body containing a "text" field. It validates the input and then uses the createStreamResponse function to stream a summary of the text back to the client in real-time.
router.post(
  "/summarize",
  async (
    req: Request<unknown, unknown, SummarizeBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { text } = req.body;

      // if the text field is missing, not a string, or empty after trimming, return a 400 error
      if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
          error: "The request body must include a non-empty text field.",
        });
      }

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-transform");
      res.flushHeaders();

      await createStreamResponse(
        `Summarize the following text in a clear, concise paragraph:\n\n${text}`,
        res,
      );
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  },
);

// The /rewrite endpoint accepts a POST request with a JSON body containing a "text" field and an optional "tone" field. It validates the input and then uses the createStreamResponse function to stream a rewritten version of the text back to the client in real-time, using the specified tone or defaulting to "professional".
router.post(
  "/rewrite",
  async (
    req: Request<unknown, unknown, RewriteBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { text, tone = "professional" } = req.body;

      // Validate the text field
      if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
          error: "The request body must include a non-empty text field.",
        });
      }

      // Validate the tone field
      if (typeof tone !== "string" || !tone.trim()) {
        return res.status(400).json({
          error: "The tone field must be a non-empty string when provided.",
        });
      }

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-transform");
      res.flushHeaders();

      await createStreamResponse(
        `Rewrite the following text with a ${tone} tone, preserving the original meaning:\n\n${text}`,
        res,
      );
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  },
);

export default router;
