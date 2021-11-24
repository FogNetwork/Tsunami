var encoding = (ctx) => {
  switch(ctx.encode) {
    case "plain":
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return str;
        }
      }
      break;
    case "xor":
      return {
        encode(str) {
          return (encodeURIComponent(str.split('').map((char,ind)=>ind%2?String.fromCharCode(char.charCodeAt()^2):char).join('')));
        },
        decode(str) {
          if (!str.startsWith('hvtrs')) return str
          return (decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''))
        }
      }
      break;
    case "base64":
      return {
        encode(str) {
          return new Buffer.from(str).toString("base64");
        },
        decode(str) {
          if (new Buffer.from(str).toString("base64").startsWith('http')) {
            return str
          }
          return new Buffer.from(str, "base64").toString("utf-8");
        }
      }
      break;
    default:
      return {
        encode(str) {
          return str;
        },
        decode(str) {
          return (str.split('https:/').startsWith('/') ? str : str.replace('https:/', 'https://'));
        }
      }
  }
}

if (typeof module !== undefined) module.exports = encoding;