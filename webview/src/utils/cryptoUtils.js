const crypto = require('crypto')

import { v4 } from 'uuid';
let ivBytes = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
let listIntDummySet = [112, 120, 127, 131, 135, 140, 144, 152, 157, 161, 168, 173, 177, 183, 191, 199];

var methods = {
  RSAEncrypt(data, publicInputKey){
    /*
      byte[] bPublicKey2 = Base64.decode(strKeyInput.getBytes("utf-8"), Base64.DEFAULT);
      KeyFactory keyFactory2 = KeyFactory.getInstance("RSA");
      X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(bPublicKey2);
      PublicKey publicKey = keyFactory2.generatePublic(publicKeySpec);
      Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
      // 공개키 이용 암호화
      cipher.init(Cipher.ENCRYPT_MODE, publicKey);
      byte[] bCipher = cipher.doFinal(strValueInput.getBytes("utf-8"));
      strResult = Base64.encodeToString(bCipher, Base64.DEFAULT);
    */
    try {
      const stringPublicKey = '-----BEGIN PUBLIC KEY-----'+
      publicInputKey+
      '-----END PUBLIC KEY-----';
      const bytePublicKey = Buffer.from(Buffer.from(stringPublicKey, 'utf8'),'base64');
      const padding = crypto.constants.RSA_PKCS1_PADDING;
      const encrypted = crypto.publicEncrypt(
        { key: bytePublicKey, padding: padding },
        Buffer.from(data, 'utf8')
      );
      const encryptedData = encrypted.toString('base64');
      return encryptedData;
    } catch (e) {
      console.log('err',e)
    }
  },
	AESEncrypt(data) {
    /*
      CLog.write("Crypto", "AES_Encode() : Key Input = " + key);
      byte[] textBytes = str.getBytes("UTF-8");
      AlgorithmParameterSpec ivSpec = new IvParameterSpec(ivBytes);
      SecretKeySpec newKey = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
      Cipher cipher = null;
      cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
      cipher.init(Cipher.ENCRYPT_MODE, newKey, ivSpec);
      return android.util.Base64.encodeToString(cipher.doFinal(textBytes), 0);
    */
      var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
      var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
      var encrypted = CryptoJS.AES.encrypt("Message", key, { iv: iv });
		return '';
	},
  AESDecrypt(data){
    return '';
  },
  encryptAuthKey(){
    return 'BA' + process.env.VUE_APP_VERSIONNUM + v4().slice(0,32);
  }
};

export default methods;
