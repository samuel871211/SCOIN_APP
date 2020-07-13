from flask import Flask, render_template, request
from werkzeug.security import check_password_hash, generate_password_hash
from flask_socketio import SocketIO, emit
import random
app = Flask(__name__)
socketio = SocketIO(app)

import pymongo
client = pymongo.MongoClient("mongodb+srv://shemira:cat2163472@cluster0-quiji.mongodb.net/<user_info>?retryWrites=true&w=majority")

@app.route('/')
def Init():
    return render_template('Init.html')

@app.route('/Login.html')
def Login():
	return render_template('Login.html')

@app.route('/ChatRoom.html')
def ChatRoom():
	return render_template('ChatRoom.html')

@app.route('/AlreadyInChatRoom')
def AlreadyInChatRoom():
	res = client["ChatRoom"]["Confirm"].find_one({"_id":request.args.get("_id")[1:]})
	if res["username"] != request.args.get("username"):
		return "Rejected"
	elif res["username"] == request.args.get("username"):
		return "OK"

@app.route('/EnterChatRoom')
def EnterChatRoom():
	for i in client["ChatRoom"]["Confirm"].find():
		if check_password_hash(i["_id"],request.args.get("password")) and i["username"] == request.args.get("username"):
			return str(i["ChatRoom"]) + i["_id"]
	return "Rejected"

@app.route('/SignUp.html')
def SignUp():
	return render_template('SignUp.html')

@app.route('/UserCenter.html')
def UserCenter():
	return render_template('UserCenter.html')

@app.route('/BountyBoard.html')
def BountyBoard():
	return render_template('BountyBoard.html')

@app.route('/Paragraph.html')
def Paragraph():
	return render_template('Paragraph.html')

@app.route('/Pair.html')
def Pair():
	return render_template('Pair.html')

@app.route('/Diary.html')
def Diary():
	return render_template('Diary.html')

@app.route('/ImgBox.html')
def ImgBox():
	return render_template('ImgBox.html')

@app.route('/Contact.html')
def Contact():
	return render_template('Contact.html')

@app.route('/ManageMyParagraph.html')
def ManageMyParagraph():
	return render_template('ManageMyParagraph.html')

@app.route('/ManageMyBounty.html')
def ManageMyBounty():
	return render_template("ManageMyBounty.html")

@app.route('/PublishBounty.html')
def PublishBounty():
	return render_template('PublishBounty.html')

@app.route('/PublishParagraph.html')
def PublishParagraph():
	return render_template('PublishParagraph.html')

@app.route('/SeeParagraph.html')
def SeeParagraph():
	return render_template('SeeParagraph.html')

@app.route('/mail.html')
def mail():
	return render_template('mail.html')

@app.route('/SignUpReward.html')
def SignUpRewardHTML():
	return render_template('SignUpReward.html')

@app.route('/home.html')
def home():
	return render_template('home.html')

@app.route('/trade.html')
def trade():
	return render_template('trade.html')

@app.route('/games.html')
def games():
	return render_template('games.html')

@app.route('/WinningNumbers')
def WinningNumbers():
	return client["Games"]["WinningNumbersFor539"].find_one({"_id":request.args.get("today")+"Daily539WinningNumbers"})

@app.route('/Join539')
def Join539():
	numbers = request.args.get("numbers")
	user = request.args.get("username")
	today = request.args.get("today")

	predict = []
	if numbers != None:
		for i in range(5):
			predict.append(numbers.split(",")[i])

	res = client["Games"][user].find_one({"_id":user+"Daily539"})
	if res == None:
		if numbers == None:
			return "new client start539"
		client["Games"][user].insert_one({"_id":user+"Daily539","consecutive":[today],today:predict})
		res2 = client["Games"]["WinningNumbersFor539"].find_one({"_id":today+"Daily539WinningNumbers"})
		if res2 == None:
			WinningNumbers = [str(random.randint(1,39))]
			while len(WinningNumbers) < 5:
			    number = str(random.randint(1,39))
			    if number not in WinningNumbers:
			        WinningNumbers.append(number)
			CountDuplicate = 0
			for i in range(len(predict)):
				if predict[i] in WinningNumbers:
					CountDuplicate += 1
			client["Games"]["WinningNumbersFor539"].insert_one({"_id":today+"Daily539WinningNumbers","WinningNumbers":WinningNumbers,"Rank":[user+";"+str(CountDuplicate)]})
		elif res2 != None:
			CountDuplicate = 0
			for i in range(len(predict)):
				if predict[i] in res2["WinningNumbers"]:
					CountDuplicate += 1
			res2["Rank"].insert(0,user+";"+str(CountDuplicate))
			client["Games"]["WinningNumbersFor539"].update_one({"_id":today+"Daily539WinningNumbers"},{"$set":res2})
		return "new client inserting numbers"

	if today != res["consecutive"][0]:
		if numbers == None:
			return "today first start539"
		res["consecutive"].insert(0,today)
		client["Games"][user].update_one({"_id":user+"Daily539"},{"$set":{"consecutive":res["consecutive"],today:predict}})
		res2 = client["Games"]["WinningNumbersFor539"].find_one({"_id":today+"Daily539WinningNumbers"})
		if res2 == None:
			WinningNumbers = [str(random.randint(1,39))]
			while len(WinningNumbers) < 5:
			    number = str(random.randint(1,39))
			    if number not in WinningNumbers:
			        WinningNumbers.append(number)
			CountDuplicate = 0
			for i in range(len(predict)):
				if predict[i] in WinningNumbers:
					CountDuplicate += 1
			client["Games"]["WinningNumbersFor539"].insert_one({"_id":today+"Daily539WinningNumbers","WinningNumbers":WinningNumbers,"Rank":[user+";"+str(CountDuplicate)]})
		elif res2 != None:
			CountDuplicate = 0
			for i in range(len(predict)):
				if predict[i] in res2["WinningNumbers"]:
					CountDuplicate += 1
			res2["Rank"].insert(0,user+";"+str(CountDuplicate))
			client["Games"]["WinningNumbersFor539"].update_one({"_id":today+"Daily539WinningNumbers"},{"$set":res2})
		return "today first inserting numbers"
	return {today:res[today]}

@app.route('/JoinABGame')
def JoinABGame():
	user = request.args.get("username")
	today = request.args.get("today")
	res = client["Games"][user].find_one({"_id":user+"DailyABGame"})
	if res == None: 
		number = str(random.randint(1000,9999))
		while number[0] == number[1] or number[0] == number[2] or number[0] == number[3] or number[1] == number[2] or number[1] == number[3] or number[2] == number[3]:
		    number = str(random.randint(1000,9999))
		client["Games"][user].insert_one({"_id":user+"DailyABGame","consecutive":[today],today:[number]})
		return "new client"
	if today != res["consecutive"][0]:
		number = str(random.randint(1000,9999))
		while number[0] == number[1] or number[0] == number[2] or number[0] == number[3] or number[1] == number[2] or number[1] == number[3] or number[2] == number[3]:
		    number = str(random.randint(1000,9999))
		res["consecutive"].insert(0,today)
		client["Games"][user].update_one({"_id":user+"DailyABGame"},{"$set":{"consecutive":res["consecutive"],today:[number]}})
		return "today first join"
	return {today:res[today]}

@app.route('/DetermineAB')
def DetermineAB():
	user = request.args.get("username")
	res = client["Games"][user].find_one({"_id":user+"DailyABGame"})
	CountA , CountB = 0 , 0
	number = request.args.get("number")
	today = request.args.get("today")
	for i in range(4):
		if number[i] in res[today][0] and number[i] == res[today][0][i]:
			CountA += 1
		elif number[i] in res[today][0] and number[i] != res[today][0][i]:
			CountB += 1
	res[today].append(number+","+str(CountA)+"A"+str(CountB)+"B")
	client["Games"][user].update_one({"_id":user+"DailyABGame"},{"$set":res})
	return str(len(res[today])-1)+","+str(CountA)+"A"+str(CountB)+"B"

@app.route('/GetLayer1')
def GetLayer1():
	return client["user_info"]["new_user"].find_one({"rev":request.args.get("rev")})

@app.route('/IsReceived')
def IsReceived():
	res = client["user_info"]["new_user"].find_one({"_id":request.args.get("_id")})
	if res == None: return "User doesn't exist."
	if res["rev"] != "no": return "AlreadyReceived"
	if res["rev"] == "no": return "no"

@app.route('/ReceivedSignUpToken')
def ReceivedSignUpToken():
	client["user_info"]["new_user"].update_one({"_id":request.args.get("_id")},{"$set":{"rev":request.args.get("rev")}})
	return "OK."

@app.route('/GetMyMail')
def GetMyMail():
	res = {"time":[],"thing":[],"initiator":[],"href":[],"author":[],"initiator":[]}
	for i in client["Mail"][request.args.get("username")].find(sort=[('$natural',-1)]):
		client["Mail"][request.args.get("username")].update_one(i,{"$set":{"read":"yes"}})
		res["time"].append(i["time"])
		res["thing"].append(i["thing"])
		res["initiator"].append(i["initiator"])
		res["href"].append(i["href"])
		res["author"].append(i["author"])
	return res

@app.route('/login')
def login():
	query = {"_id":request.args.get("username")}
	res = client["user_info"]["new_user"].find_one(query)
	if res == None:
		return "Username is wrong."
	if check_password_hash(res["password"],request.args.get("password")):
		return "OK."
	return "Password is wrong."

@app.route('/JoinDailyPair')
def JoinDailyPair():
	res = client["user_info"]["new_user"].find_one({"_id":request.args.get("username")})
	if res == None:
		return "User doesn't exist."
	if check_password_hash(res["password"],request.args.get("password")) == False:
		return "Password is wrong."
	if client["ChatRoom"]["Confirm"].find_one({"_id":res["password"],"username":res["_id"]}) == None:
		ChatRoom = client["ChatRoom"]["Confirm"].count_documents({}) // 2 + 1
		client["ChatRoom"]["Confirm"].insert_one({"_id":res["password"],"username":res["_id"],"ChatRoom":ChatRoom})
		return "OK."
	return "Duplicate request."
	
@app.route('/SendAdvise')
def SendAdvise():
	a = {
		"username":request.args.get("username"),
		"title":request.args.get("title"),
		"description":request.args.get("description")
	}
	return str(client["Contact"]["advise"].insert_one(a))

@app.route('/GetCertainParagraph')
def GetCertainParagraph():
	a = {"_id":request.args.get("_id")}
	return client["Paragraph"]["P"].find_one(a)

@app.route('/GetParagraphByClass')
def GetParagraphByClass():
	res = {"title":[],"paragraph":[],"_id":[],"time":[],"like":[],"dislike":[],"class":[],"ResponseLength":[]}
	for i in client["Paragraph"]["P"].find({"class":request.args.get("class")},sort=[('$natural',-1)]):
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["class"].append(i["class"])
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	return res

@app.route('/GetParagraphBySort')
def GetParagraphBySort():
	arr = []
	if request.args.get("sort") == "LikeCount":
		for i in client["Paragraph"]["P"].find():
			if arr == []: 
				arr.append(i)
			else:
				det = True
				for j in range(len(arr)):
					if len(i["like"]) > len(arr[j]["like"]):
						arr.insert(j,i)
						det = False
						break
				if det:
					arr.append(i)
	elif request.args.get("sort") == "ResponseCount":
		for i in client["Paragraph"]["P"].find():
			if arr == []: 
				arr.append(i)
			else:
				det = True
				for j in range(len(arr)):
					if len(i["response"][0]["content"]) > len(arr[j]["response"][0]["content"]):
						arr.insert(j,i)
						det = False
						break
				if det:
					arr.append(i)
	res = {"title":[],"paragraph":[],"_id":[],"time":[],"like":[],"dislike":[],"class":[],"ResponseLength":[]}
	for i in arr:
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["class"].append(i["class"])
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	return res

@app.route('/SearchParagraph')
def SearchParagraph():
	res = {"title":[],"paragraph":[],"_id":[],"time":[],"like":[],"dislike":[],"class":[],"ResponseLength":[]}
	SubStr = request.args.get("title")
	for i in client["Paragraph"]["P"].find({"title":{'$regex':SubStr}},sort=[('$natural',-1)]):
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["class"].append(i["class"])
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	return res

@app.route('/InsertNewParagraph')
def InsertNewParagraph():
	a = {
		"_id":generate_password_hash(request.args.get("title")),
		"username":request.args.get("username"),
		"title":request.args.get("title"),
		"paragraph":request.args.get("paragraph"),
		"class":request.args.get("class"),
		"time":request.args.get("time"),
		"like":[],
		"dislike":[],
		"response":[{"username":[],"content":[],"time":[],"like":[],"dislike":[]}],
	}
	return str(client['Paragraph']['P'].insert_one(a))

@app.route('/InsertEmotionToParagraph')
def InsertEmotionToParagraph():
	query = {"_id":request.args.get("_id")}
	res = client["Paragraph"]["P"].find_one(query)
	name = request.args.get("username")
	emotion = request.args.get("emotion")
	if name not in res["like"] and name not in res["dislike"]:
		res[emotion].append(name)
		client["Paragraph"]["P"].update_one(query,{"$set":{emotion:res[emotion]}})
		return "OK."
	return "Duplicate sending emotion."

@app.route('/UnreadMailLength')
def UnreadMailLength():
	count = 0
	for i in client["Mail"][request.args.get("username")].find():
		if i["read"] == "no":
			count += 1
	return str(count)

@app.route('/MailFromBounty')
def MailFromBounty():
	query = {
		"username":request.args.get("author"),
		"class":request.args.get("class"),
		"thing":request.args.get("PublishThing"),
		"reward":request.args.get("reward"),
		"time":request.args.get("PublishTime")
	}
	res = client["BountyBoard"]["OnBoard"].find_one(query)
	client["BountyBoard"]["OnBoard"].delete_one(res)
	res["acceptor"] = request.args.get("initiator")
	client["BountyBoard"]["Trading"].insert_one(res)
	data = {
		"time":request.args.get("time"),
		"thing":request.args.get("thing"),
		"initiator":request.args.get("initiator"),
		"author":request.args.get("author"),
		"read":"no",
		"href":"/trade.html?"+res["_id"]
	}
	client["Mail"][request.args.get("initiator")].insert_one(data)
	client["Mail"][request.args.get("author")].insert_one(data)
	return data["href"]

@app.route('/CheckBuyerAndSeller')
def CheckBuyerAndSeller():
	res = client["BountyBoard"]["Trading"].find_one({"_id":request.args.get("_id")})
	WhoAreYou = request.args.get("WhoAreYou")
	if res["username"] != WhoAreYou and res["acceptor"] != WhoAreYou:
		return "Rejected"
	return res
@app.route('/MailFromParagraphEmotion')
def MailFromParagraphEmotion():
	data = {
		"time":request.args.get("time"),
		"thing":request.args.get("thing"),
		"initiator":request.args.get("initiator"),
		"href":request.args.get("href"),
		"read":"no",
		"author":request.args.get("author")
	}
	return str(client["Mail"][request.args.get("author")].insert_one(data))

@app.route('/MailFromTagResponse')
def MailFromTagResponse():
	data = {
		"time":request.args.get("time"),
		"thing":request.args.get("thing"),
		"initiator":request.args.get("initiator"),
		"href":request.args.get("href"),
		"read":"no",
		"author":request.args.get("author")
	}
	return str(client["Mail"][request.args.get("author")].insert_one(data))

@app.route('/MailFromParagraphResponse')
def MailFromParagraphResponse():
	data = {
		"time":request.args.get("time"),
		"thing":request.args.get("thing"),
		"initiator":request.args.get("initiator"),
		"href":request.args.get("href"),
		"read":"no",
		"author":request.args.get("author")
	}
	return str(client["Mail"][request.args.get("author")].insert_one(data))

@app.route('/MailFromResponseEmotion')
def MailFromResponseEmotion():
	data = {
		"time":request.args.get("time"),
		"thing":request.args.get("thing"),
		"initiator":request.args.get("initiator"),
		"href":request.args.get("href"),
		"read":"no",
		"author":request.args.get("author")
	}
	return str(client["Mail"][request.args.get("author")].insert_one(data))


@app.route('/InsertEmotionToResponse')
def InsertEmotionToResponse():
	query = {"_id":request.args.get("_id")}
	res = client["Paragraph"]["P"].find_one(query)
	name = request.args.get("username")
	floor =  int(request.args.get("FloorAndEmotion").split(",")[0])
	emotion = request.args.get("FloorAndEmotion").split(",")[1]
	if name not in res["response"][0]["like"][floor] and name not in res["response"][0]["dislike"][floor]:
		res["response"][0][emotion][floor].append(name)
		client["Paragraph"]["P"].update_one(query,{"$set":{"response":res["response"]}})
		return "OK."
	return "Duplicate sending emotion."

@app.route('/InsertNewResponse')
def InsertNewResponse():
	query = {"_id":request.args.get("_id")}
	find = client["Paragraph"]["P"].find_one(query)
	find["response"][0]["username"].append(request.args.get("username"))
	find["response"][0]["content"].append(request.args.get("content"))
	find["response"][0]["time"].append(request.args.get("time"))
	find["response"][0]["like"].append([])
	find["response"][0]["dislike"].append([])
	return str(client["Paragraph"]["P"].update_one(query,{"$set":{"response":find["response"]}}))

@app.route('/GetAllParagraph')
def GetAllParagraph():
	res = {"title":[],"paragraph":[],"_id":[],"time":[],"like":[],"dislike":[],"class":[],"ResponseLength":[]}
	for i in client['Paragraph']['P'].find(sort=[('$natural',-1)]):
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["class"].append(i["class"])
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	return res

@app.route('/GetMyParagraph')
def GetMyParagraph():
	res = {"title":[],"paragraph":[],"_id":[],"ResponseLength":[],"time":[],"like":[],"dislike":[],"class":[]}
	for i in client['Paragraph']['P'].find({"username":request.args.get("username")},sort=[('$natural',-1)]):
		res["class"].append(i["class"])
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	return res
 
@app.route('/GetMyBounty')
def GetMyBounty():
	username = request.args.get("username")
	result = {"username":username,"thing":[],"reward":[],"time":[],"place":[],"class":[]}
	for i in client['BountyBoard']["OnBoard"].find({"username":username},sort=[('$natural',-1)]):
		result["class"].append(i["class"])
		result["thing"].append(i["thing"])
		result["reward"].append(i["reward"])
		result["time"].append(i["time"])
		result["place"].append(i["place"])
	return result

@app.route('/InsertNewBounty')
def InsertNewBounty():
	a = {
		"thing":request.args.get("thing"),
		"reward":request.args.get("reward"),
		"time":request.args.get("time"),
		"place":request.args.get("place"),
		"username":request.args.get("username"),
		"class":request.args.get("class"),
		"PostTime":request.args.get("PostTime"),
		"_id":generate_password_hash(request.args.get("thing")+request.args.get("reward")+request.args.get("time")+request.args.get("username")+request.args.get("class")+request.args.get("PostTime"))
	}
	client['BountyBoard']['OnBoard'].insert_one(a)
	return "OK"

@app.route('/InsertNewAccount')
def InsertNewAccount():
	a = {
		"_id":request.args.get("_id"),
		"password":generate_password_hash(request.args.get("password")),
		"major":request.args.get("major"),
		"grade":request.args.get("grade"),
		"studentid":request.args.get("studentid"),
		"gender":request.args.get("gender"),
		"DateAccountCreated":request.args.get("DateAccountCreated"),
		"gmail":request.args.get("gmail"),
		"TxnHash":request.args.get("TxnHash"),
		"rev":"no"
		}
	return str(client['user_info']['new_user'].insert_one(a))

@app.route('/CheckUsername')
def CheckUsername():
	result = client['user_info']['new_user'].find_one({"_id":request.args.get("_id")})
	if result == None:
		return "Account can be registered."
	else:
		return "Account has been registered."

@app.route('/GetAllBounty')
def GetAllBounty():
	result = {"thing":[],"reward":[],"time":[],"place":[],"class":[],"username":[]}
	for i in client['BountyBoard']['OnBoard'].find(sort=[('$natural',-1)]):
		result["username"].append(i["username"])
		result["thing"].append(i["thing"])
		result["reward"].append(i["reward"])
		result["time"].append(i["time"])
		result["place"].append(i["place"])
		result["class"].append(i["class"])
	return result

@app.route('/DeleteBounty')
def DeleteBounty():
	a = {
		"thing":request.args.get("thing"),
		"reward":request.args.get("reward")
	}
	return str(client['BountyBoard']['OnBoard'].delete_one(a))

@app.route('/GetALLChatHistory')
def GetALLChatHistory():
	ID = "ChatRoom" + request.args.get("ChatRoom")
	return client["ChatRoom"]["History"].find_one({"_id":ID})

@app.route('/DailyReward')
def DailyReward():
	user = request.args.get("username")
	today = request.args.get("today")
	res = client["Diary"][user].find_one({"_id":user+"DailyReward"})
	if res == None:
		client["Diary"][user].insert_one({"_id":user+"DailyReward","DailyReward":[today]})
		return "Sending DailyReward."
	if res["DailyReward"] == [] or res["DailyReward"][0] != today:
		res["DailyReward"].insert(0,today)
		client["Diary"][user].update_one({"_id":user+"DailyReward"},{"$set":res})
		return "Sending DailyReward."
	return "Duplicate Request."

@app.route('/GetDiary')
def GetDairy():
	user = request.args.get("username")
	date = request.args.get("date")
	res = client["Diary"][user].find_one({"_id":user+"Diary"+date})
	if res == None: return "New Diary"
	return res["content"]

@app.route('/NewDiary')
def NewDiary():
	user = request.args.get("username")
	query = {"_id":user+"Diary"+request.args.get("date")}
	res = client["Diary"][user].find_one(query)
	if res == None:
		client["Diary"][user].insert_one({"_id":user+"Diary"+request.args.get("date"),"content":request.args.get("content")})
		return "Diary Successfully Inserted"
	client["Diary"][user].update_one(query,{"$set":{"content":request.args.get("content")}})
	return "Diary Successfully Modified"

@socketio.on('Server')
def HandleMessage(RoomID,username,time,message):
	socketio.emit(RoomID,{"username":username,"time":time,"message":message})

	query = {"_id":"ChatRoom"+RoomID}
	res = client["ChatRoom"]["History"].find_one(query)
	res["username"].append(username)
	res["time"].append(time)
	res["message"].append(message)
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

@socketio.on('ServerConnect')
def connect(RoomID,username,time):
	socketio.emit(RoomID+"connect",{"username":username,"time":time})

	query = {"_id":"ChatRoom"+RoomID}
	res = client["ChatRoom"]["History"].find_one(query)
	res["username"].append(username)
	res["time"].append(time)
	res["message"].append("entered the chat room.")
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

@socketio.on('ServerDisconnect')
def ServerDisconnect(RoomID,username,time):
	socketio.emit(RoomID+"disconnect",{"username":username,"time":time})

	query = {"_id":"ChatRoom"+RoomID}
	res = client["ChatRoom"]["History"].find_one(query)
	res["username"].append(username)
	res["time"].append(time)
	res["message"].append("left the chat room.")
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

if __name__ == '__main__':
    socketio.run(app,host="0.0.0.0",debug=True)