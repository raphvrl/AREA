## 📚 Adding New Features

---

### 🔌 How to Add a New Service

1. **🛠️ Add Service Configuration**
   ```typescript
   // web/src/constants/services.ts
   export const services = [
     {
       id: 'your_service',
       name: 'Your Service',
       icon: YourServiceIcon,
       color: 'bg-[#your-color]',
       description: 'Your service description'
     }
   ];
   ```

2. **🔑 Add OAuth2 Configuration**
   ```typescript
   // server/src/api/auth.ts
   router.get('/auth/your_service', async (req, res) => {
     const redirectUri = `${process.env.CALLBACK_URL}/your_service`;
     const authUrl = `https://your-service.com/oauth2/authorize?`
       + `client_id=${process.env.YOUR_SERVICE_CLIENT_ID}&`
       + `redirect_uri=${redirectUri}&`
       + `response_type=code`;
     res.redirect(authUrl);
   });
   ```

3. **🌍 Add Environment Variables**
   ```env
   YOUR_SERVICE_CLIENT_ID=***
   YOUR_SERVICE_CLIENT_SECRET=***
   ```

---

### ⚡ How to Add a New Action

1. **📝 Create Action Handler**
   ```typescript
   // server/src/services/action/yourAction.ts
   export const yourAction = async (email: string): Promise<ActionResult | null> => {
     try {
       const user = await UserModel.findOne({ email });
       const apiKey = user.apiKeys.get('your_service');
       
       // Your action logic here
       
       return {
         message: '✅ Action completed successfully',
         data: resultData
       };
     } catch (error) {
       console.error('❌ Error in yourAction:', error);
       throw new Error('Action failed');
     }
   };
   ```

2. **📌 Register Action**
   ```typescript
   // web/src/constants/actions.ts
   export const availableActions = [
     {
       id: 'yourAction_service',
       service: 'your_service',
       type: 'yourAction',
       description: 'Your action description'
     }
   ];
   ```

3. **🔗 Add to Area Handlers**
   ```typescript
   // server/src/services/areaHandlers.ts
   import { yourAction } from './action/yourAction';

   export const actionHandlers: { [key: string]: Handler } = {
     'yourAction_service': yourAction
   };
   ```

---

### 🔄 How to Add a New Reaction

1. **⚡ Create Reaction Handler**
   ```typescript
   // server/src/services/reaction/yourReaction.ts
   export const yourReaction = async (email: string, actionData: any): Promise<ReactionResult> => {
     try {
       const user = await UserModel.findOne({ email });
       const apiKey = user.apiKeys.get('your_service');
       
       // Your reaction logic here
       
       return {
         message: '✅ Reaction completed successfully',
         data: resultData
       };
     } catch (error) {
       console.error('❌ Error in yourReaction:', error);
       throw new Error('Reaction failed');
     }
   };
   ```

2. **📌 Register Reaction**
   ```typescript
   // web/src/constants/actions.ts
   export const availableReactions = [
     {
       id: 'yourReaction_service',
       service: 'your_service',
       type: 'yourReaction',
       description: 'Your reaction description'
     }
   ];
   ```

3. **🔗 Add to Area Handlers**
   ```typescript
   // server/src/services/areaHandlers.ts
   import { yourReaction } from './reaction/yourReaction';

   export const reactionHandlers: { [key: string]: Handler } = {
     'yourReaction_service': yourReaction
   };
   ```

---

### 🔍 Best Practices

#### 🛠️ 1. Error Handling
✅ Always wrap your code in `try-catch` blocks  
✅ Log errors with meaningful messages  
✅ Return appropriate error responses  

#### 🔐 2. Authentication
🔑 Verify user authentication before any operation  
🔑 Check for valid API tokens  
🔑 Handle token refreshes when needed  

#### 🧪 3. Testing
✅ Write unit tests for new actions/reactions  
✅ Test error cases and edge scenarios  
✅ Verify OAuth2 flow works correctly  

---
