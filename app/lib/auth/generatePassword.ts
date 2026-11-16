export function GeneratePassword() {
     let result = ""

     const characters = process.env.CHARACTER_NEW_PASSWORD!
     const charactersLength = characters.length

     for (let i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
     }
     return result
}
