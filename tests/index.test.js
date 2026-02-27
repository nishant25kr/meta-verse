import axios from "axios"

const BACKEND_URL = "http://localhost:3000"
const WS_BACKEND_URL = "ws://localhost:3001"

describe("Authentication", () => {

    test("user is able to signup only once", async () => {

        const username = "nishant" + Math.random();
        const password = "12345"
        const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        expect(res.status).toBe(200)

        const Secondres = axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        expect(Secondres.status).toBe(400)

    })

    test("SignIn success if the username and password is correct", async () => {
        const username = "Nishant" + Math.random()
        const password = 12345
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username,
            password
        })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDescribe()

    })

    test("SignIn fails if the username and password is incorrect", async () => {
        const username = "Nishant" + Math.random()
        const password = 12345
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })

        const Newusername = "Nishant" + Math.random()
        const Newpassword = 12345

        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            Newusername,
            Newpassword
        })

        expect(res.status).toBe(403)
    })
})

describe("User metadata end points", () => {

    let token = "";
    let avatarId = "";

    beforeAll(async () => {
        const username = "Nishant" + Math.random()
        const password = "12345"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        token = res.data.token
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            'imageUrl': ";alskdf;ljadljf;ladf;",
            "name": "hello"
        })
        avatarId = avatarResponse.data.avatarId
    })

    test("User can't update there metadata wiht wrong avatar id", async () => {
        const res = await axios(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: 143134
        }, {
            header: {
                "authorization": `Bearer ${token}`
            }
        })
        expect(res.status).toBe(400);
    })

    test("User can update there metadata wiht write avatar id", async () => {
        const res = await axios(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            header: {
                "authorization": `Bearer ${token}`
            }
        })
        expect(res.status).toBe(200);
    })

    test("User is not able to update the metadata if the auth header is not given", async () => {
        const res = await axios(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })
        expect(res.status).toBe(403);
    })

})

describe("User avatar end points", () => {
    let avatarId;
    let token
    let userId

    beforeAll(async () => {
        const username = "Nishant" + Math.random()
        const password = "12345"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username,
            password,
            type: "admin"
        })

        token = res.data.token
        userId = res.data.userId

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            'imageUrl': ";alskdf;ljadljf;ladf;",
            "name": "hello"
        })
        avatarId = avatarResponse.data.avatarId
    })

    test("Get back avatar information for a user", () => {
        const res = axios.get(`${BACKEND_URL}/api/v1/metadata/bulk?ids=[${userId}]`)
        expect(res.data.avatars.length).toBe(1)
        expect(res.data.avatars[0].userId).toBe(userId)
    })

    test("Availables avatars lists the recently created avatar", async () => {
        const res = await axios.get(`${BACKEND_URL}/api/v1/avatars`)
        expect(res.data.avatars.length).not.toBe(0)
        const currentAvatar = res.data.avatars.find(x => x.id === avatarId)
        expect(currentAvatar).toBeDefined()
    })

})

describe("Space information", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminId;
    let adminToken;
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = "Nishant" + Math.random()
        const password = "12345"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username,
            password,
            type: "admin"
        })

        adminToken = res.data.token
        adminId = res.data.userId

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username : username - `${"user"}`,
            password,
            type: "user"
        })
        const Userres = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username : username - `${"user"}`,
            password,
            type: "user"
        })

        userToken = Userres.data.token
        userId = Userres.data.userId


        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        element1Id = element1.data.id
        element2Id = element1.data.id

        map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: "chair1",
                x: 20,
                y: 20
            }, {
                elementId: "chair2",
                x: 18,
                y: 20
            }, {
                elementId: "table1",
                x: 19,
                y: 20
            }, {
                elementId: "table2",
                x: 19,
                y: 20
            }
            ]

        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })


    })

    test("User is able to create a space", async () => {
        const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
            "dimensions": "100*200",
            "mapId": mapId
        }, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(res.spaceId).toBeDefined()

    })

    test("User is able to create a space with a mapId", async () => {
        const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
            "dimensions": "100*200",
        }, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(res.spaceId).toBeDefined()

    })

    test("User is not able to create a space without dimensions and mapId", async () => {
        const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
        }, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(res.status).toBe(400)
    })

    test("User is not able to delete a space which dosent exist", async () => {
        const res = axios.delete(`${BACKEND_URL}/api/v1/space/randomId`, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(res.status).toBe(400)
    })

    test("User is able to delete a space which exist", async () => {
        const res = axios.delete(`${BACKEND_URL}/api/v1/space/randomId`, {
            "name": "test",
            "dimensions": "100*200",
        }, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })

        const deleteRes = axios.delete(`${BACKEND_URL}/api/v1/space/${res.data.spaceId}`)
        expect(deleteRes.status).toBe(200)
    })

    test("User is not able to delete a space created by another user", async () => {

        const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
            "dimensions": "100*200",
            "mapId": mapId
        })

        const deleteres = axios.delete(`${BACKEND_URL}/api/v1/space/spaceId}`, {
            header: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(deleteres.status).toBe(400)
    })



})

describe("Arena information", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminId;
    let adminToken;
    let userToken;
    let userId;
    let spaceId;


    beforeAll(async () => {
        const username = "Nishant" + Math.random()
        const password = "12345"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username,
            password,
            type: "admin"
        })

        adminToken = res.data.token
        adminId = res.data.userId

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username : username - `${"user"}`,
            password,
            type: "user"
        })
        const Userres = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username :username - `${"user"}`,
            password,
            type: "user"
        })

        userToken = Userres.data.token
        userId = Userres.data.userId


        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        element1Id = element1.data.id
        element2Id = element2.data.id

        map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: "chair1",
                x: 20,
                y: 20
            }, {
                elementId: "chair2",
                x: 18,
                y: 20
            }, {
                elementId: "table1",
                x: 19,
                y: 20
            }, {
                elementId: "table2",
                x: 19,
                y: 20
            }
            ]

        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        mapId = map.data.mapId

        const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": "map1"
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = space.data.spaceId

    })

    test("Incorrect spaceId returns a 400", async () => {
        const res = await axios.get(`${BACKEND_URL}/api/v1/space/a;dlf231`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(res.status).toBe(400)
    })

    test("Correct spaceId returns all the elements", async () => {
        const res = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(res.data.dimensions).toBe("100 * 200")
        expect(res.data.elements.length).toBe(3)
    })


    test("Delete enpoint is able to delete", async () => {
        const res = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            spaceId,
            elementId: res.data.elements[0].id
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const newRes = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)

        expect(newRes.data.length).toBe(2)
    })

    test("Adding an element work as execpted", async () => {
        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50,
            "y": 20
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const newRes = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(newRes.data.length).toBe(3)
    })

    test("Adding an element to wrong spaceId does not work", async () => {
        const res = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 5000000,
            "y": 2000000
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(res.status).toBe(400)
    })

})

describe("Admin endpoints", () => {
    let adminId;
    let adminToken;
    let userToken;
    let userId;


    beforeAll(async () => {
        const username = "Nishant" + Math.random()
        const password = "12345"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const res = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username,
            password,
            type: "admin"
        })

        adminToken = res.data.token
        adminId = res.data.userId

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username = username - `${"user"}`,
            password,
            type: "user"
        })
        const Userres = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            username = username - `${"user"}`,
            password,
            type: "user"
        })

        userToken = Userres.data.token
        userId = Userres.data.userId
    })

    test("User is not able to hit admin endpoints", async () => {

        const element1Res = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const mapRes = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [
            ]
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const AvatarRes = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            'imageUrl': ";alskdf;ljadljf;ladf;",
            "name": "hello"
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })
        
        const UpdateAvatarRes = await axios.put(`${BACKEND_URL}/api/v1/admin/element`, {
            'imageUrl': ";alskdf;ljadljf;ladfasdfasdfasdf;",
            "name": "hello"
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        expect(element1Res.status).toBe(403)
        expect(mapRes.status).toBe(403)
        expect(AvatarRes.status).toBe(403)
        expect(UpdateAvatarRes.status).toBe(403)

    })

    test("Admin is not able to hit admin endpoints", async () => {

        const element1Res = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        const mapRes = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [
            ]
        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        const AvatarRes = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            'imageUrl': ";alskdf;ljadljf;ladf;",
            "name": "hello"
        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })
    
        expect(element1Res.status).toBe(200)
        expect(mapRes.status).toBe(200)
        expect(AvatarRes.status).toBe(200)

    })

    test("Admin is able to update the image url", async () => {

        const elementRes = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        },{
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        const UpdateAvatarRes = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementRes.data.id}`, {
            'imageUrl': ";alskdf;ljadljf;ladfasdfasdfasdf;",
            "name": "hello"
        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        expect(UpdateAvatarRes.status).toBe(200)

    })

})

describe("WebSocket tests",()=>{
    let adminToken;
    let AdminUserId;
    let userToken;
    let UserId
    let mapId;
    let element1Id;
    let element2Id;
    let adminId;
    let userId;
    let spaceId;
    let ws1;
    let ws2;
    let ws1Messages = []
    let ws2Messages = []

    async function HttpSetup(){
        const username = "Nishant"+Math.random()
        const password = "12345"
        const AdminSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role:"admin"
        }) 
        const AdminSigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
        }) 
        AdminUserId = AdminSignupRes.data.userId
        adminToken = AdminSigninRes.data.token

        const UserSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username: username+"-user",
            password,
            role:"user"
        }) 
        const UserSigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username+"-user",
            password,
        }) 
        UserId = UserSignupRes.data.userId
        userToken = UserSigninRes.data.token


        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            header: {
                "authorization": `Bearer ${userToken}`
            }
        })

        element1Id = element1.data.id
        element2Id = element2.data.id

        map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: "chair1",
                x: 20,
                y: 20
            }, {
                elementId: "chair2",
                x: 18,
                y: 20
            }, {
                elementId: "table1",
                x: 19,
                y: 20
            }, {
                elementId: "table2",
                x: 19,
                y: 20
            }
            ]

        }, {
            header: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        mapId = map.data.mapId

        const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": "map1"
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = space.data.spaceId
    }

    function waitForAndPopLatestMessage(messageArray){    
        return new Promise((resolve)=>{
            if(messageArray.length() > 0 ){
                resolve(messageArray.shift())
            }else{
                let interval = setTimeout(()=>{
                    if(messageArray.length > 0){
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                },100)
            }
        })
    }

    async function WebSocketSetup(){
        ws1 = new WebSocket(WS_BACKEND_URL)
        ws2 = new WebSocket(WS_BACKEND_URL)

        await new Promise((resolve) => {
            ws1.onopen = resolve
        })

        await new Promise((resolve) => {
            ws2.onopen = resolve
        })

            ws1.onmessage = (message) => {
                ws1Messages.push(JSON.parse(message.data))
            }

            ws2.onmessage = (message) => {
                ws2Messages.push(JSON.parse(message.data))
            }

        
    }

    beforeAll( async () => {
        

    })



})

