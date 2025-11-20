import stations from "./stations";
let statuschargeing = [
    { id:1, plugin: stations[0].plugins[0].id, status: 'charging' },
    { id:2, plugin: stations[0].plugins[1].id, status: 'available' },
    { id:3, plugin: stations[1].plugins[0].id, status: 'charging' },
];
export default statuschargeing;