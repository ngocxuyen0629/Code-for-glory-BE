# Code-For-Glory — Database Schemas (NestJS + MongoDB)

Tất cả Mongoose schema cho 13 module của hệ thống Code-For-Glory, dựng theo
Milestone 2 doc (survey, user-flow, schema diagram trên SwaggerHub).

## Cấu trúc thư mục

```
src/
├── common/enums/index.ts          # Enum dùng chung cho mọi module
├── users/schemas/
│   ├── user.schema.ts             # Tài khoản + profile + gamification
│   ├── login-attempt.schema.ts    # Log đăng nhập (exponential backoff)
│   └── user-ranking.schema.ts     # ELO/rating theo từng career field
├── auth/schemas/
│   ├── refresh-token.schema.ts    # JWT refresh token rotation
│   └── otp.schema.ts              # OTP cho password reset
├── learning-path/schemas/
│   ├── roadmap.schema.ts          # Roadmap FE/BE/Fullstack
│   ├── roadmap-node.schema.ts     # Từng node (lesson/lab/quiz) trên cây
│   └── user-progress.schema.ts    # Trạng thái mỗi node theo user
├── exercises/schemas/
│   ├── question.schema.ts         # Câu hỏi (quiz/coding/lab)
│   ├── exercise.schema.ts         # Lab/Mini-Project
│   └── submission.schema.ts       # Bản ghi mỗi lần submit code
├── battles/schemas/
│   ├── battle.schema.ts           # Trận 1v1 (Performance/Speed)
│   ├── battle-submission.schema.ts# Submit trong trận battle
│   └── code-analysis.schema.ts    # AI Mentor's post-battle review
├── ai-mentor/schemas/
│   ├── ai-chat-session.schema.ts  # 1 session = 1 hội thoại
│   └── ai-chat-message.schema.ts  # Từng message (matches doc schema)
├── error-tracking/schemas/
│   └── error-tracking.schema.ts   # Diagnostic Sanctorum / radar chart
├── penalties/schemas/
│   └── penalty.schema.ts          # Quota, cooldown, lock state
├── recall/schemas/
│   ├── recall.schema.ts           # Spaced Repetition (SM-2)
│   └── recall-test.schema.ts      # Bài kiểm tra mở lại lock
├── history/schemas/
│   ├── learning-history.schema.ts # Activity log
│   └── bookmark.schema.ts         # Bài đã lưu / Bookmarked Lore
├── notifications/schemas/
│   └── notification.schema.ts     # In-app + push notification
├── admin/schemas/
│   └── admin-config.schema.ts     # Cấu hình admin (AI/penalty rules)
└── survey/schemas/
    └── survey-response.schema.ts  # Câu trả lời onboarding survey
```

## Mapping với schema diagram (SwaggerHub)

| Schema trong diagram | File tương ứng                                    |
| -------------------- | ------------------------------------------------- |
| USER                 | `users/schemas/user.schema.ts`                    |
| USER_RANKING         | `users/schemas/user-ranking.schema.ts`            |
| QUESTIONS            | `exercises/schemas/question.schema.ts`            |
| ROADMAPS             | `learning-path/schemas/roadmap.schema.ts`         |
| ROADMAPNODES         | `learning-path/schemas/roadmap-node.schema.ts`    |
| USER_PROGRESS        | `learning-path/schemas/user-progress.schema.ts`   |
| BATTLES              | `battles/schemas/battle.schema.ts`                |
| CODE_ANALYSIS        | `battles/schemas/code-analysis.schema.ts`         |
| AIChatMessage        | `ai-mentor/schemas/ai-chat-message.schema.ts`     |
| ERROR_TRACKING       | `error-tracking/schemas/error-tracking.schema.ts` |
| PENALTIES            | `penalties/schemas/penalty.schema.ts`             |
| RECALL_SYSTEM        | `recall/schemas/recall.schema.ts`                 |

Các schema còn lại (Bookmark, Notification, SurveyResponse, RefreshToken, Otp,
LoginAttempt, AiChatSession, RecallTest, Exercise, Submission, BattleSubmission,
AdminConfig, LearningHistory) là bổ sung suy ra từ user-flow + UI để hỗ trợ đầy
đủ tính năng (authen flow, OTP, history page, notification escalation, v.v.).

## Cách đăng ký vào module

Mỗi module NestJS cần import schema qua `MongooseModule.forFeature(...)`.
Ví dụ với `users` module:

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
  LoginAttempt,
  LoginAttemptSchema,
} from './schemas/login-attempt.schema';
import { UserRanking, UserRankingSchema } from './schemas/user-ranking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: UserRanking.name, schema: UserRankingSchema },
    ]),
  ],
  // controllers, providers, exports ...
})
export class UsersModule {}
```

Tương tự cho các module còn lại.

## Convention

- `@Schema({ timestamps: true })` → tự sinh `createdAt`, `updatedAt`.
- `@Schema({ timestamps: { createdAt: true, updatedAt: false } })` cho
  collection append-only (log, message, history).
- `@Schema({ _id: false })` cho subdocument nhúng (không cần `_id` riêng).
- Tất cả relation đều dùng `Types.ObjectId` + `ref: 'ModelName'`.
- TTL index dùng cho OTP, refresh token, login attempt → Mongo tự xoá.
- Compound index đặt cuối file, ưu tiên các query pattern thường gặp
  (`{ userId: 1, createdAt: -1 }` cho list-by-user-by-time).

## Mapping nghiệp vụ → schema

- **Penalty logic (sai >=5/>=10 lần)** → `penalties` + `recall-test` reset quota.
- **Streak break escalation (1/3/7 ngày)** → `notifications.escalationLevel`.
- **Skip lesson** → `UserProgress.status = SKIPPED`.
- **Bài bị khoá tạm thời** → `UserProgress.status = TEMP_LOCKED` + `lockedUntil`.
- **Spaced Repetition** → `recall.schema.ts` (SM-2: interval/easeFactor/repetitions).
- **Battle matching** → `Battle.matchingEloRange` + `UserRanking.field`.
- **AI Mentor "chỉ gợi ý, không cho code"** → `AiChatMessage.hintType` + `hintLevel`.

## Cài thư viện

```bash
yarn install @nestjs/mongoose mongoose
```

`package.json` cần đảm bảo:

```json
{
  "dependencies": {
    "@nestjs/mongoose": "^10.0.0",
    "mongoose": "^8.0.0"
  }
}
```
