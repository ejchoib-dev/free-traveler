import { describe, it, expect } from "vitest";

/**
 * UNIT-MATE-STATE — 동행 상태 전이 단위 테스트
 *
 * REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037
 * MATE_POST: OPEN → CLOSED → DELETED / OPEN → HIDDEN
 * MATE_APPLICATION: PENDING → ACCEPTED/REJECTED → (WITHDRAWN)
 */

type MatePostStatus = "OPEN" | "CLOSED" | "HIDDEN" | "DELETED";
type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

interface MatePost {
  id: string;
  status: MatePostStatus;
}

interface MateApplication {
  id: string;
  postId: string;
  status: MateApplicationStatus;
}

// 상태 전이 규칙
function canTransitionPost(
  from: MatePostStatus,
  to: MatePostStatus
): boolean {
  const transitions: Record<MatePostStatus, MatePostStatus[]> = {
    OPEN: ["CLOSED", "HIDDEN"],
    CLOSED: ["DELETED"],
    HIDDEN: ["OPEN", "DELETED"],
    DELETED: [],
  };
  return transitions[from].includes(to);
}

function transitionPost(post: MatePost, to: MatePostStatus): MatePost {
  if (!canTransitionPost(post.status, to)) {
    throw new Error(
      `Cannot transition from ${post.status} to ${to}`
    );
  }
  return { ...post, status: to };
}

function canTransitionApplication(
  from: MateApplicationStatus,
  to: MateApplicationStatus
): boolean {
  const transitions: Record<MateApplicationStatus, MateApplicationStatus[]> = {
    PENDING: ["ACCEPTED", "REJECTED"],
    ACCEPTED: ["WITHDRAWN"],
    REJECTED: [],
    WITHDRAWN: [],
  };
  return transitions[from].includes(to);
}

function transitionApplication(
  app: MateApplication,
  to: MateApplicationStatus
): MateApplication {
  if (!canTransitionApplication(app.status, to)) {
    throw new Error(
      `Cannot transition from ${app.status} to ${to}`
    );
  }
  return { ...app, status: to };
}

describe("Mate Post State Transitions (REQ-FUNC-035, REQ-FUNC-036)", () => {
  describe("Valid Transitions", () => {
    it("should transition from OPEN to CLOSED", () => {
      const post: MatePost = { id: "1", status: "OPEN" };
      const updated = transitionPost(post, "CLOSED");
      expect(updated.status).toBe("CLOSED");
    });

    it("should transition from OPEN to HIDDEN", () => {
      const post: MatePost = { id: "1", status: "OPEN" };
      const updated = transitionPost(post, "HIDDEN");
      expect(updated.status).toBe("HIDDEN");
    });

    it("should transition from CLOSED to DELETED", () => {
      const post: MatePost = { id: "1", status: "CLOSED" };
      const updated = transitionPost(post, "DELETED");
      expect(updated.status).toBe("DELETED");
    });

    it("should transition from HIDDEN to OPEN", () => {
      const post: MatePost = { id: "1", status: "HIDDEN" };
      const updated = transitionPost(post, "OPEN");
      expect(updated.status).toBe("OPEN");
    });

    it("should transition from HIDDEN to DELETED", () => {
      const post: MatePost = { id: "1", status: "HIDDEN" };
      const updated = transitionPost(post, "DELETED");
      expect(updated.status).toBe("DELETED");
    });
  });

  describe("Invalid Transitions", () => {
    it("should not transition from OPEN to OPEN", () => {
      const post: MatePost = { id: "1", status: "OPEN" };
      expect(() => transitionPost(post, "OPEN")).toThrow();
    });

    it("should not transition from CLOSED to OPEN", () => {
      const post: MatePost = { id: "1", status: "CLOSED" };
      expect(() => transitionPost(post, "OPEN")).toThrow();
    });

    it("should not transition from CLOSED to HIDDEN", () => {
      const post: MatePost = { id: "1", status: "CLOSED" };
      expect(() => transitionPost(post, "HIDDEN")).toThrow();
    });

    it("should not transition from DELETED state", () => {
      const post: MatePost = { id: "1", status: "DELETED" };
      expect(() => transitionPost(post, "OPEN")).toThrow();
      expect(() => transitionPost(post, "CLOSED")).toThrow();
    });
  });

  describe("Complete State Paths", () => {
    it("should complete path: OPEN → CLOSED → DELETED", () => {
      let post: MatePost = { id: "1", status: "OPEN" };
      post = transitionPost(post, "CLOSED");
      expect(post.status).toBe("CLOSED");
      post = transitionPost(post, "DELETED");
      expect(post.status).toBe("DELETED");
    });

    it("should complete path: OPEN → HIDDEN → DELETED", () => {
      let post: MatePost = { id: "1", status: "OPEN" };
      post = transitionPost(post, "HIDDEN");
      expect(post.status).toBe("HIDDEN");
      post = transitionPost(post, "DELETED");
      expect(post.status).toBe("DELETED");
    });

    it("should complete path: OPEN → HIDDEN → OPEN → CLOSED → DELETED", () => {
      let post: MatePost = { id: "1", status: "OPEN" };
      post = transitionPost(post, "HIDDEN");
      expect(post.status).toBe("HIDDEN");
      post = transitionPost(post, "OPEN");
      expect(post.status).toBe("OPEN");
      post = transitionPost(post, "CLOSED");
      expect(post.status).toBe("CLOSED");
      post = transitionPost(post, "DELETED");
      expect(post.status).toBe("DELETED");
    });
  });
});

describe("Mate Application State Transitions (REQ-FUNC-037)", () => {
  describe("Valid Transitions", () => {
    it("should transition from PENDING to ACCEPTED", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "PENDING",
      };
      const updated = transitionApplication(app, "ACCEPTED");
      expect(updated.status).toBe("ACCEPTED");
    });

    it("should transition from PENDING to REJECTED", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "PENDING",
      };
      const updated = transitionApplication(app, "REJECTED");
      expect(updated.status).toBe("REJECTED");
    });

    it("should transition from ACCEPTED to WITHDRAWN", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "ACCEPTED",
      };
      const updated = transitionApplication(app, "WITHDRAWN");
      expect(updated.status).toBe("WITHDRAWN");
    });
  });

  describe("Invalid Transitions", () => {
    it("should not transition from PENDING to WITHDRAWN", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "PENDING",
      };
      expect(() => transitionApplication(app, "WITHDRAWN")).toThrow();
    });

    it("should not transition from REJECTED to ACCEPTED", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "REJECTED",
      };
      expect(() => transitionApplication(app, "ACCEPTED")).toThrow();
    });

    it("should not transition from WITHDRAWN to any state", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "WITHDRAWN",
      };
      expect(() => transitionApplication(app, "PENDING")).toThrow();
      expect(() => transitionApplication(app, "ACCEPTED")).toThrow();
    });

    it("should not transition from REJECTED to any state", () => {
      const app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "REJECTED",
      };
      expect(() => transitionApplication(app, "PENDING")).toThrow();
      expect(() => transitionApplication(app, "ACCEPTED")).toThrow();
    });
  });

  describe("Complete State Paths", () => {
    it("should complete path: PENDING → ACCEPTED → WITHDRAWN", () => {
      let app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "PENDING",
      };
      app = transitionApplication(app, "ACCEPTED");
      expect(app.status).toBe("ACCEPTED");
      app = transitionApplication(app, "WITHDRAWN");
      expect(app.status).toBe("WITHDRAWN");
    });

    it("should complete path: PENDING → REJECTED", () => {
      let app: MateApplication = {
        id: "1",
        postId: "p1",
        status: "PENDING",
      };
      app = transitionApplication(app, "REJECTED");
      expect(app.status).toBe("REJECTED");
    });
  });
});

describe("Combined State Machine Tests", () => {
  it("should handle multiple posts and applications independently", () => {
    const post1: MatePost = { id: "p1", status: "OPEN" };
    const post2: MatePost = { id: "p2", status: "OPEN" };

    const updated1 = transitionPost(post1, "CLOSED");
    const updated2 = transitionPost(post2, "HIDDEN");

    expect(updated1.status).toBe("CLOSED");
    expect(updated2.status).toBe("HIDDEN");
  });

  it("should track multiple applications for same post", () => {
    const app1: MateApplication = {
      id: "a1",
      postId: "p1",
      status: "PENDING",
    };
    const app2: MateApplication = {
      id: "a2",
      postId: "p1",
      status: "PENDING",
    };

    const updated1 = transitionApplication(app1, "ACCEPTED");
    const updated2 = transitionApplication(app2, "REJECTED");

    expect(updated1.status).toBe("ACCEPTED");
    expect(updated2.status).toBe("REJECTED");
  });
});
