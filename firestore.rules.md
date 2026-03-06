# Firebase Firestore Xavfsizlik Qoidalari

Ushbu ilova uchun Firestore xavfsizlik qoidalari foydalanuvchi ma'lumotlarini himoya qilish uchun mo'ljallangan.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Foydalanuvchi profili
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Tranzaksiyalar sub-kolleksiyasi
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Kategoriyalar sub-kolleksiyasi
      match /categories/{categoryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Budjetlar sub-kolleksiyasi
      match /budgets/{budgetId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## O'rnatish bo'yicha ko'rsatmalar

1. [Firebase Console](https://console.firebase.google.com/) ga kiring.
2. Loyihangizni tanlang.
3. "Firestore Database" bo'limiga o'ting.
4. "Rules" tabini tanlang.
5. Yuqoridagi qoidalarni nusxalab joylang va "Publish" tugmasini bosing.
