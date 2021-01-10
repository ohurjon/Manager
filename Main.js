const Discord = require("discord.js");
const client = new Discord.Client();
const Canvas = require("canvas");
const Setting = require("./Data/settings.json");
const File = require("fs");
const moment = require("moment-timezone");
const got = require("got");
var guild, canvas, ctx, err_channel, role;

Canvas.registerFont("./Texture/NanumBarunGothic.ttf", { family: "Nanum" });
Canvas.registerFont("./Texture/seguiemj.ttf", { family: "Emoji" });
client.login(Setting.Discord_Token);

client.on("ready", async () => {
  guild = client.guilds.cache.get("427102167929847808");
  welcome = guild.channels.cache.get("634387764602732579");
  message = await welcome.messages.fetch("634387973886181396");
  ticket = guild.channels.cache.get("719182455101194330");
  t_message = await ticket.messages.fetch("719182514270240768");
  err_channel = guild.channels.cache.get("701119696782753875");
  role = await guild.roles.fetch("427127404079611918");
  manage = guild.channels.cache.get("726004093654532097");
  m_message = await manage.messages.fetch({ limit: 10 });
  log = guild.channels.cache.get("725200180386857011");
  console.log();
  console.log();
  console.log(`접속 중인 봇 ${client.user.tag} (${client.user.id})`);
  console.log();
  console.log();
});

client.on("message", async (message) => {
  embed = new Discord.MessageEmbed();
  prefix = Setting.Prefix;
  const arg = message.content.split(" ");
  const command = arg[0].replace(prefix, "");
  arg.shift();
  if ((/\|\|((?:.|\W|\s)+)\|\|/.test(message.content) || /\~\~((?:.|\W|\s)+)\~\~/.test(message.content)) && !(message.author.bot)) {
    message.delete()
    message.author.send("취소선과 스포일러는 사용하실수 없습니다.")
  } else {
    switch (command) {
      case "help":
        embed.setAuthor("도움말", client.user.avatarURL());
        embed.addField(prefix + "help", "이 봇의 명령어들을 확인 가능합니다.");
        embed.addField(
          prefix + "aud",
          "메시지를 보낸 서버의 인원을 확인 가능합니다."
        );
        embed.addField(
          prefix + "invite",
          "메시지를 보낸 서버의 초대 링크를 가져옵니다."
        );
        embed.addField(
          prefix + "rule",
          "메시지를 보낸 서버의 규칙을 확인합니다."
        );
        embed.addField(prefix + "youtube", "파워무비 유튜브 링크를 봅니다.");
        //embed.addField(prefix+"new","파워무비 유튜브의 가장 최신 영상을 가져옵니다.");
        embed.addField(prefix + "ee", "유튜브 코드가 맞는지 검사합니다.");
        message.channel.send(embed);
        break;
      case "aud":
        embed.setAuthor("현재 인원", client.user.avatarURL());
        embed.setDescription(
          `현재 ${message.guild.memberCount}명의 유저가 있습니다!`
        );
        message.channel.send(embed);
        break;
      case "invite":
        embed.setAuthor("초대 코드", client.user.avatarURL());
        embed.setDescription(
          "이 서버의 초대코드는 https://discord.gg/hNnBvAn 입니다."
        );
        message.channel.send(embed);
        break;
      case "rule":
        embed.setAuthor("규칙", client.user.avatarURL());
        embed.setDescription("규칙은 <#719177411832578159> 확인 바랍니다.");
        message.channel.send(embed);
        break;
      case "ee":
        if (arg[0].length <= 11) {
          embed.setAuthor("이스터에그", client.user.avatarURL());
          json = await got(
            `https://www.googleapis.com/youtube/v3/videos?key=${Setting.Youtube_Token}&part=status&id=${arg[0]}`
          );
          body = JSON.parse(json.body);
          if (body.pageInfo.totalResults == 0) {
            embed.setDescription("영상 검색 결과가 없습니다.").setColor("RED");
            message.channel.send(embed);
          } else {
            if (body.items[0].status.privacyStatus == "unlisted") {
              embed
                .setDescription(
                  `올바른 유튜브 링크로 이어집니다!\n\n[보러가기](https://www.youtube.com/watch?v=${body.items[0].id})`
                )
                .setImage(
                  `https://i.ytimg.com/vi/${body.items[0].id}/maxresdefault.jpg`
                )
                .setColor("GREEN");
              message.channel.send(embed);
            } else {
              embed.setDescription("비공개 영상이 아닙니다.").setColor("RED");
              message.channel.send(embed);
            }
          }
        } else {
          embed
            .setAuthor("이스터에그", client.user.avatarURL())
            .setDescription("영상 검색 결과가 없습니다.")
            .setColor("RED");
          message.channel.send(embed);
        }
        break;
      default:
        break;
    }
  }
});

client.on("messageUpdate", async (Oldmessage, NewMessage) => {
  if (!(Oldmessage.content == NewMessage.content) && (/\|\|((?:.|\W|\s)+)\|\|/.test(NewMessage.content) || /\~\~((?:.|\W|\s)+)\~\~/.test(NewMessage.content)) && !(NewMessage.author.bot)) {
    NewMessage.delete()
    NewMessage.author.send("취소선과 스포일러는 사용하실수 없습니다.")
  }
})

client.on("guildMemberAdd", async (member) => {
  welcome = await guild.channels.cache.find(
    (channel) => channel.id == "695993355339038721"
  );

  canvas = Canvas.createCanvas(1100, 500);

  ctx = canvas.getContext("2d");

  //var background = await Canvas.loadImage(Setting.Background);
  //ctx.drawImage(background,-1*(background.width/2-550),0)
  ctx.fillRect(0, 0, 1100, 500);
  ctx.font = "50px Nanum Emoji";
  ctx.textAlign = "center";
  ctx.fillStyle = "White";
  ctx.fillText(member.user.tag, canvas.width / 2, canvas.height / 1.38);
  ctx.font = `40px Nanum Emoji`;
  ctx.fillText(guild.name, canvas.width / 2, canvas.height / 1.15);

  avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "png" })
  );

  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 3,
    256 / 2 + 5,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  ctx.clip();
  ctx.fillRect(0, 0, 1100, 500);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 3, 256 / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(
    avatar,
    canvas.width / 2 - 128,
    canvas.height / 3 - 128,
    256,
    256
  );
  img = await canvas.toBuffer();
  pic = new Discord.MessageAttachment(img, "Welcome.png");

  welcome.send(`${guild.name}에 ${member}님이 들어오셨습니다!`, pic);

  await File.readFile("./Data/Roles.json", "utf-8", async (err, data) => {
    if (err) {
      err_channel.send(err);
    } else {
      Roles = JSON.parse(data);
      if (Roles.find((o) => o.id == member.id)) {
        await Roles.find((o) => o.id == member.id).roles.forEach(
          async (role) => {
            member.roles
              .add(await guild.roles.fetch(role), "원래 있던 역할")
              .catch((err) => {
                err_channel.send(err);
              });
          }
        );
      }
    }
  });
});
client.on("messageReactionAdd", async (msr, user) => {
  if (msr.message.id == "634387973886181396") {
    guild.member(user).roles.add(role);
  }

  //자멸 시스템
  if (msr.message.channel.topic == user.id) {
    msr.message.channel.delete();

    ManageMessages = await manage.messages.fetch({ limit: 10 });
    ManageMessage = ManageMessages.find(
      (message) =>
        message.embeds[0].fields.find((field) => field.name == "ID").value == user.id
    );
    NewManageEmbed = new Discord.MessageEmbed();

    ManageEmbed = await ManageMessage.embeds[0];

    NewManageEmbed.setAuthor(
      ManageEmbed.author.name,
      ManageEmbed.author.iconURL
    );
    NewManageEmbed.setDescription("실수로 만들어진 신고 채널입니다.");
    NewManageEmbed.setFooter("로그 없이 삭제 되었습니다.");

    ManageMessage.edit(NewManageEmbed);

    ManageMessage.reactions.removeAll();
  }

  // 타멸 시스템
  if (msr.message.channel.id == manage.id && !user.bot) {

    ReportChannel = client.channels.cache.find(
      (channel) => msr.message.embeds[0].fields[0].value == channel.topic
    );

    ManageEmbed = msr.message.embeds[0];

    LogEmbed = new Discord.MessageEmbed();
    NewManageEmbed = new Discord.MessageEmbed();

    LogEmbed.setAuthor(ManageEmbed.author.name, ManageEmbed.author.iconURL);

    ReportChannelMessages = await ReportChannel.messages.fetch({ limit: 100 });
    await ReportChannelMessages.sort(
      (userA, userB) => userA.createdTimestamp - userB.createdTimestamp
    );
    await ReportChannelMessages.forEach((message) => {
      if (message.content) {
        LogEmbed.addField(
          message.author.username +
          " | " +
          moment(message.createdTimestamp)
            .tz("Asia/Seoul")
            .format("YYYY-MM-DD h:mm:ss"),
          message.content
        );
        if (LogEmbed.length > 1024) {
          LogEmbedFileds = LogEmbed.fields
          LogEmbedFileds.pop();
          LogEmbed.fields = LogEmbedFileds;
          log.send(LogEmbed);
          LogEmbed.fields = {};
        }
      }
    });


    await log.send(LogEmbed);



    await ReportChannel.delete();

    NewManageEmbed.setAuthor(
      ManageEmbed.author.name,
      ManageEmbed.author.iconURL
    );

    NewManageEmbed.setDescription("신고 채널이 삭제 되었습니다!");
    NewManageEmbed.setFooter("로그를 로그방에 남겼습니다.");

    EditManageMessage = await msr.message.edit(NewManageEmbed);
    await EditManageMessage.reactions.removeAll();
  }

  if (msr.message.id == "719182514270240768" && !user.bot) {
    await msr.remove();
    await msr.message.react("586230301714546698");
    inform = [];
    await guild.channels.cache.forEach((channel) => inform.push(channel.topic));
    if (!inform.includes(user.id)) {
      member = await guild.member(user);
      category = await guild.channels.cache.get("719187478829072414");
      channel = await guild.channels.create(member.displayName, {
        topic: user.id,
        permissionOverwrites: [
          {
            id: user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },

          {
            id: guild.id,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: client.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"],
          },
        ],
        parent: category,
      });
      embed = new Discord.MessageEmbed();
      embed.setAuthor(member.displayName, user.avatarURL());
      embed.setDescription("신고 채널이 생성 되었습니다!");
      embed.setFooter("잘못 누르셨다면 밑 이미지를 눌러 주시길 바랍니다.");
      //embed.addField("알림","모든 메시지 내용은 관리자가 열람 가능합니다.")
      NewChannelMessage = await channel.send(member, embed);
      await NewChannelMessage.react("❌");
      embed.setAuthor(member.displayName, user.avatarURL());
      embed.addField("ID", member.user.id);
      embed.setDescription("신고 채널이 생성 되었습니다!");
      embed.setFooter(
        `해당 신고방을 닫고 로그를 남기려면 밑 이모지를 눌러 주시길 바랍니다.`
      );
      b = await manage.send(embed);
      await b.react("❌");
    }
  }
});

client.on("guildMemberRemove", async (member) => {
  await File.readFile("./Data/Roles.json", "utf-8", async (err, data) => {
    if (err) {
      embed.setDescription(err);
      err_channel.send(embed);
    } else {
      if (data == "") {
        map = [];
      } else {
        map = JSON.parse(data);
      }
      roles = [];
      member.roles.cache.forEach((role) => {
        if (!(role.id == member.guild.id)) {
          roles.push(role.id);
        }
      });
      if (map.find((o) => o.id == member.id)) {
        map.splice(
          map.findIndex((o) => o.id == member.id),
          1
        );
      }
      map.push({
        id: member.id,
        roles: roles,
      });
      await File.writeFile(
        "./Data/Roles.json",
        JSON.stringify(map),
        async (err) => {
          if (err) {
            err_channel.send(err);
          }
        }
      );
    }
  });
});

/*client.on("channelDelete", async (channel) =>{
    if(/\d/.test(channel.topic) && channel.parent.id == '719187478829072414'){
        ManageMessages = await manage.messages.fetch({limit:100});
        ManageMessage = await ManageMessages.find(message => message.embeds[0].fields.find(field => field.name == "ID").value == channel.topic);
        NewManageEmbed = new Discord.MessageEmbed();
        ManageEmbed = ManageMessage.embeds[0];
        NewManageEmbed.setAuthor(ManageEmbed.author.name,ManageEmbed.author.iconURL)
                        .setDescription("외부적인 요인으로 신고 채널이 삭제 되었습니다!")
                        .setFooter("외부적인 요인으로 인해 로그가 남지 않았습니다.");
        ManageMessage.edit(NewManageEmbed);
        ManageMessage.reactions.removeAll();
    }
})*/
