export const getRandomUser = (allUsers) => {
    return allUsers[Math.floor(Math.random() * allUsers.length)];
}