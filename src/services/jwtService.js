const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const config = require('../utils/config');
const logger = require('../utils/logger');

class JWTService {
  constructor() {
    this.guestAccountsPath = path.join(__dirname, '../../data/guest_accounts.json');
    this.generatedTokensPath = path.join(__dirname, '../../data/generated_tokens.json');
    
    // Log the paths for debugging
    logger.info('Guest accounts path:', this.guestAccountsPath);
    logger.info('Generated tokens path:', this.generatedTokensPath);
  }

  async loadGuestAccounts() {
    // Try multiple possible paths for both local and deployed environments
    const possiblePaths = [
      this.guestAccountsPath,
      path.join(process.cwd(), 'data/guest_accounts.json'),
      path.join(__dirname, '../../../data/guest_accounts.json'),
      path.join(__dirname, '../../data/guest_accounts.json'),
      './data/guest_accounts.json',
      path.join(process.cwd(), 'src/../data/guest_accounts.json')
    ];

    let accounts = null;
    let usedPath = null;

    for (const filePath of possiblePaths) {
      try {
        await fs.access(filePath);
        logger.info(`Guest accounts file found at: ${filePath}`);
        const data = await fs.readFile(filePath, 'utf8');
        accounts = JSON.parse(data);
        usedPath = filePath;
        break;
      } catch (err) {
        logger.debug(`File not found at: ${filePath}`);
      }
    }

    if (!accounts) {
      logger.error('Error loading guest accounts: File not found');
      logger.error('File paths attempted:', possiblePaths);
      logger.error('Current working directory:', process.cwd());
      logger.error('__dirname:', __dirname);
      
      // List directory contents for debugging
      try {
        const rootFiles = require('fs').readdirSync(process.cwd());
        logger.error('Root directory contents:', rootFiles);
        
        if (rootFiles.includes('data')) {
          const dataFiles = require('fs').readdirSync(path.join(process.cwd(), 'data'));
          logger.error('Data directory contents:', dataFiles);
        }
      } catch (listError) {
        logger.error('Error listing directory contents:', listError.message);
      }
      
      // Try to download from GitHub as fallback
      logger.info('Attempting to download guest accounts from GitHub...');
      try {
        accounts = await this.downloadGuestAccountsFromGitHub();
        logger.info(`Successfully downloaded ${accounts.length} guest accounts from GitHub`);
        return accounts;
      } catch (downloadError) {
        logger.error('Failed to download from GitHub:', downloadError.message);
        throw new Error('Guest accounts file not found in any expected location and GitHub download failed');
      }
    }

    logger.info(`Successfully loaded ${accounts.length} guest accounts from: ${usedPath}`);
    return accounts;
  }

  async downloadGuestAccountsFromGitHub() {
    try {
      const githubUrl = `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/main/data/guest_accounts.json`;
      logger.info(`Downloading from: ${githubUrl}`);
      
      const response = await axios.get(githubUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'JWT-Token-Manager/1.0.0',
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const accounts = response.data;
        logger.info(`Downloaded ${accounts.length} guest accounts from GitHub`);
        
        // Try to save locally for future use
        try {
          const localPath = path.join(process.cwd(), 'data/guest_accounts.json');
          await fs.mkdir(path.dirname(localPath), { recursive: true });
          await fs.writeFile(localPath, JSON.stringify(accounts, null, 2));
          logger.info('Saved guest accounts locally for future use');
        } catch (saveError) {
          logger.warn('Could not save guest accounts locally:', saveError.message);
        }
        
        return accounts;
      } else {
        throw new Error(`GitHub API returned status: ${response.status}`);
      }
    } catch (error) {
      logger.error('Error downloading from GitHub:', error.message);
      logger.error('GitHub URL attempted:', `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/main/data/guest_accounts.json`);
      
      // Fallback to hardcoded data
      logger.info('Falling back to hardcoded guest accounts data...');
      return this.getHardcodedGuestAccounts();
    }
  }

  getHardcodedGuestAccounts() {
    // Hardcoded fallback with sample guest accounts
    // This ensures the app always works even if GitHub is unreachable
    logger.info('Using hardcoded guest accounts as final fallback');
    
    const hardcodedAccounts =[
  {
    "uid": "4183796841",
    "password": "1F720FF98D52DCEEC903C0D77278036F8DF923EC20E6FC796BEAA0D0C7A19458"
  },
  {
    "uid": "4183797798",
    "password": "6EFE7FA8E299AF1175D614828AFCF335CFC9095EAA7CBD9E6AC4E6698CAD9734"
  },
  {
    "uid": "4183799104",
    "password": "6C30B998DE9A4F40E3AC04FDA530A23E358994A7033851ABF6FC83022F295491"
  },
  {
    "uid": "4183800187",
    "password": "3E1EE4E7D0071522F74C6D5BB33AC20CF828846D58E67E7CEC4F798741BA7BE4"
  },
  {
    "uid": "4183800972",
    "password": "693D213979324115DE4C65BC46C40A3C1B0631F57EA68D6BF17D5648BF16D745"
  },
  {
    "uid": "4183801999",
    "password": "76C23C24F363CE3816FF2C9B0D7D1E3797101B182BA9B43319D2AA95B7653E57"
  },
  {
    "uid": "4183803150",
    "password": "AF2C662DC5190C89FF4B863DE63B71FB122B24D9BA5EC6EB7DE6EAB65F7E099A"
  },
  {
    "uid": "4183804049",
    "password": "312DA2C03D0CF1A64501CF4DEE3D5577303CCC33B6FEEDCF0A12F7F7C1A7E72B"
  },
  {
    "uid": "4183804845",
    "password": "1AC28B49E0B4EAFA4A1F0994EDCE7529C35FBD0952239A9275B602FA53E263BA"
  },
  {
    "uid": "4183805889",
    "password": "6398C44EB570097546E11C64AD5091393688E9413D0F1BD54E54F8195EFC092A"
  },
  {
    "uid": "4183807101",
    "password": "495CD1147AE01E97777858526E0C16AFC5C57653101E166BA82A7152FC8C486B"
  },
  {
    "uid": "4183807818",
    "password": "8FC75A611899A8E9BAE666A628729A207ACD2D8AFE925A0AAA3BED612E0684C0"
  },
  {
    "uid": "4183808793",
    "password": "5FBDADCF9AA70A64942B44688A4C8DDAC34D2D017929C402C839EB3D848A39D4"
  },
  {
    "uid": "4183809948",
    "password": "643FA5D9AD2D9847509FADE0546906389CF7EC7078F2785FB0D64463B0165622"
  },
  {
    "uid": "4183811003",
    "password": "EDBE87769538244F57D7C887D025B2A09FA5C625C8FF9A172B09DC2EBB540077"
  },
  {
    "uid": "4183811859",
    "password": "69D2B2308FCE0A816451B4907CA40CE45CDD72A84FAB65E186DE1D02692EF614"
  },
  {
    "uid": "4183812976",
    "password": "A14361E398413529CF49B10E029345114FBDE2D20259499CD35408BD8E561A2C"
  },
  {
    "uid": "4183814023",
    "password": "B445BBEF9C55A659786ECA5B25D434F9B3E2C0C5A94816BFA874F052671974A8"
  },
  {
    "uid": "4183815023",
    "password": "DD3342444A2DCDFDEFEAEF74AD50EC2A3D262934EC801CA804A36C9A764198AB"
  },
  {
    "uid": "4183815900",
    "password": "015BDA7A6198FE4BBECA9FE4CCB187B70CFE5BA517610BE5839CBC748E867DCE"
  },
  {
    "uid": "4183816800",
    "password": "4A795872D85477922F4DF2D877B73746AA231C1870D4EC16143401765E2506AA"
  },
  {
    "uid": "4183817864",
    "password": "19CA95F9D07607C93FC473917984F6681F57C781832E9C3D0F18E5C80C99F1C2"
  },
  {
    "uid": "4183818971",
    "password": "504F91BA57F6D9452A92C5B1B720E9CD06D7A1A8A67742D7F0CF25D40DDF4349"
  },
  {
    "uid": "4183819770",
    "password": "F38F59CE3BEEBCA34C2F2A7D88F2220D5C77EBD329F775CBCF1AA376A331A55B"
  },
  {
    "uid": "4183820775",
    "password": "4562EAC292F1B6D33141BC4D1403D2306E63C41B3D406DA9BBB2AE9784D6DD82"
  },
  {
    "uid": "4183821932",
    "password": "AB1AF43643485D969123C340C70354131A5F6ACD1A73F4E2F1343CA0FCA35C45"
  },
  {
    "uid": "4183822778",
    "password": "C37857A68FB209CE3EFE58ECE9DE60C3B70A2D1D4C3EA2B74AD723E251426FD0"
  },
  {
    "uid": "4183823673",
    "password": "05605451F5FADF3DAD5C53370F4DFE5E6EDBB5DDA041AA4F5E95E174D50305A2"
  },
  {
    "uid": "4183824803",
    "password": "EE10EA281D29D0E2C44C9D9CF31279267DC74CE5ADBC27486877F12C94A9E64F"
  },
  {
    "uid": "4183826655",
    "password": "10B9893E1675D7C98906240E3703CC69A1467760A48E5D5E200B54507CEE4266"
  },
  {
    "uid": "4183827742",
    "password": "DE9AC955724A820629C56FA512CD7A54EB0AC65F88E7132CE18EE03BBDE8B947"
  },
  {
    "uid": "4183828629",
    "password": "91E93D02AADCDF5A90164E85C8579D843EDA04356EBE6C3E99989630F046210B"
  },
  {
    "uid": "4183829637",
    "password": "E2B0A715721C3BA99A12945FFC46CE7146974A55E3A10B244166ACEBCE35111C"
  },
  {
    "uid": "4183830617",
    "password": "A1D03DDC0AB912577DEAC9FE0343A369C1EC0625FCC49C8A86CE0A6E713EFD2F"
  },
  {
    "uid": "4183831698",
    "password": "F546D6FF6C7E85C629B79F114120154F094C0F5C2F705E08933285DCBF594299"
  },
  {
    "uid": "4183832689",
    "password": "97966D44EE5A858122A8132B2592782C4ECFE23466D30F4180652CBDF06B26CC"
  },
  {
    "uid": "4183837358",
    "password": "5BD4DE09E27E4B4499F94EFCFD8A48EA728FD22EE85CA2B5D93AF3154005591E"
  },
  {
    "uid": "4183837983",
    "password": "7E3E553202B36EF0047E9FC4C92F7D0CDCA12FB090B8B2B733E4BE73A33767D5"
  },
  {
    "uid": "4183838567",
    "password": "6E43CCF555B6AEB9387768DAF7F8D77BEE36905DA8A1EC670DBEC423A2A3B578"
  },
  {
    "uid": "4183839127",
    "password": "934D77331E8B6984B63293B5C429A5C0B0205A2E18901B2D04C49E3EB652E7B2"
  },
  {
    "uid": "4183860316",
    "password": "A10E86FE845F9F0D7F183DAD848F0CD07F66A3A9AF8B8B5603E79D0FE5C2C371"
  },
  {
    "uid": "4183860959",
    "password": "8B2A51C9908B15B8490E2366B81DC10D8C1D6D9DA62606341D790D08B5627E61"
  },
  {
    "uid": "4183862261",
    "password": "7AD04D0F717985BE8956C73DC60040DD4F8E24029EFF0E72A2499B28245DDBEA"
  },
  {
    "uid": "4183862885",
    "password": "B7E7000EB06E1237C08237ABC5237BBDFB5D39BEC0FD5AB4B9BA02773CD2B4AB"
  },
  {
    "uid": "4183864184",
    "password": "0F4AC614E65122F0DE3F825A15A4657F973D3FB8A058C905225629425265B835"
  },
  {
    "uid": "4183865733",
    "password": "9B3A18CBB5E537E5EF9F14CD60E2A75563D21BACCBDD5B6F19433140C8143EDF"
  },
  {
    "uid": "4183870171",
    "password": "C91EBB3761E471CBC5C61493D4C9053EEB315E4847E8C3258E7C042A9801445F"
  },
  {
    "uid": "4183871350",
    "password": "1BE066C638FCD8183C28D58845D5212D96BFED031EDDCBDFC61BD0D888A41475"
  },
  {
    "uid": "4183872285",
    "password": "9E0E594ED64B59F3A5D5A7BD11E6DDD8E5929502AF8FBE369F4EA503C2F18F5E"
  },
  {
    "uid": "4183873162",
    "password": "8E8C591327B817F9170D16B9E1A033D5B191A3B8E8A90FA17B5C47BE173F10A1"
  },
  {
    "uid": "4183874200",
    "password": "59954FD107DF7FDE4095EBE8AEF172E39B2CEDC231C442F98931F1D67B93B15A"
  },
  {
    "uid": "4183875122",
    "password": "E68FAF708974EAC8A806E82A279095694FC74C91DC1AC8ECC01661B0EE01FCE9"
  },
  {
    "uid": "4183876015",
    "password": "277C8179F54DC50985C83956D30BA3C1C46ACDEE7A0011D61070826E02E6735C"
  },
  {
    "uid": "4183876711",
    "password": "704C7D2F9153D2A17A62D79CDADCAFFFF666EB8F8304271E38B6FA9180032761"
  },
  {
    "uid": "4183877412",
    "password": "BECA7F68B6791F6C7C3560EDC4DB76D82719EB255AE6CE152F29B63CD9ABF15D"
  },
  {
    "uid": "4183878101",
    "password": "3B90BFA0A060FB3D896753016294E769841CE951A7A86BEE43E46CE8EBA46681"
  },
  {
    "uid": "4183878792",
    "password": "94C93FDAB5AE390083BE32553A029051F6AA247C83B6527757BCCEC77657B239"
  },
  {
    "uid": "4183879508",
    "password": "025B7AE15B3CDF460F223FE9E3D96DC8118C9C4AE4AE09358DE32AAA8E70E959"
  },
  {
    "uid": "4183880175",
    "password": "EBC511FA0566C03FD49CC8010E3F77F7C107E29F8B289B383523A9DA42CB32BD"
  },
  {
    "uid": "4183880856",
    "password": "02A8BA88BF7E5B527A9C96CBC7ED0FB6E97EAC6A6BA98C5A639CA25E200557ED"
  },
  {
    "uid": "4183881549",
    "password": "70E40066BABF6A929BA511A3CEFB43DC67589D87E49A6E4D59E8126EE095DCAB"
  },
  {
    "uid": "4183882218",
    "password": "8C065AAE1ECED14AA573B709D0263961EC105E9061F10F3500DA50E6B5F7FB4D"
  },
  {
    "uid": "4183882912",
    "password": "CD2971BD6B7959269DDBEFEF21D6D9BC3A5B5791003DEFD741DFB5452915FDE6"
  },
  {
    "uid": "4183883559",
    "password": "EE130E6A3DDB3CFF392ADDD4610E283ECADAAC2C178CCC01EF6B8156A55170A8"
  },
  {
    "uid": "4183884231",
    "password": "870384A79AD324454B78466C7762DD96DF1FA541D65F428B8A83B1D6C9500B15"
  },
  {
    "uid": "4183884905",
    "password": "054F78767527035968683C7097DD1E0A40E15A96E4597350271EC2BE68A70E68"
  },
  {
    "uid": "4183885576",
    "password": "878B89C70FD18F36EC5A6DCFF934B3CE4E6D1528F4E7B72F163990FA0BAC07EE"
  },
  {
    "uid": "4183886234",
    "password": "5B6548CEC461BC6B9AFB75894D20ED69DDE13C141D91CDA259AA1F9B3A86797C"
  },
  {
    "uid": "4183886940",
    "password": "CBED88C6FAB15A2815D626DE0C6D8DC338ED80C680DFD7A0BC0DFC07B36938E6"
  },
  {
    "uid": "4183887614",
    "password": "88B361C07C1C3C58F30AA9E286D313AADFA93798C6292A0303AF732B1FE77779"
  },
  {
    "uid": "4183888293",
    "password": "ECBF09C830FB9D6974564A5A47D74211795DE88FE8DBDFDB430DDCB8A9BD841D"
  },
  {
    "uid": "4183888915",
    "password": "20A18321E651D0E30C4D553CDB7814A5C8770ED325A0DE6F2E256A23069597CA"
  },
  {
    "uid": "4183889600",
    "password": "8E721777E87E34B3ED13B0D6393B2E8F332B4D1EF3AD1E4ECE25BD1BBFD06F50"
  },
  {
    "uid": "4183890242",
    "password": "5E2A28519EF100EADA8ABF527E88111641848D8415E2A14B88A048522C32AACD"
  },
  {
    "uid": "4183890906",
    "password": "5F4BAD848C6B16B590ED33E7EAF99B4E17F9BE0DC1136E645EDCACC6ECC2D270"
  },
  {
    "uid": "4183891529",
    "password": "FB5805505B85799BD91FB343E8AC00E34CCDF585F60D6AC62EE0C062BB4E0325"
  },
  {
    "uid": "4183892215",
    "password": "3481F904BC6B9BFF12EE16E9FB4A127340DA63AB51CEDB5689D44F4B27C5D8CC"
  },
  {
    "uid": "4183892917",
    "password": "13949EAD273E245FAB1F0A37BDCB4873C678AAE3D5EFE9CA0C78262E7BBE14F3"
  },
  {
    "uid": "4183893585",
    "password": "7E020EFC1FEC13F352E183AE7832CAF004CF27FAFE350FB251C0F0CB2F445B75"
  },
  {
    "uid": "4183895427",
    "password": "43087FE823112294FE6523575183641473C3921DDA11B6EA9D4955748E820970"
  },
  {
    "uid": "4183896065",
    "password": "0CD3757E37AB16975C0789D675E2F6FC8C44C13069B6337D0885C31639D74A34"
  },
  {
    "uid": "4183896733",
    "password": "61117F64494AE0782328B9E90B95ADA69FBF4275FC009DE6B501A1675BC57971"
  },
  {
    "uid": "4183897351",
    "password": "1442C3FC19D95CA24954EF077BA0E3E91F5F481897129C22135B4DBC447F4362"
  },
  {
    "uid": "4183898036",
    "password": "96A1204BBB0D9F331F13C40B7E75D855B39A1A67321EF2D461C079C6DE069288"
  },
  {
    "uid": "4183898647",
    "password": "9559B4E2CE9DEEEE6A60FF19A1CF9EBE44B624F93F2CDA3D0A9FBAE1B6F37309"
  },
  {
    "uid": "4183899331",
    "password": "07C54FEDF8C16604DC7B2A4EF44C519E9D12C408F335B487DC3A37C983155131"
  },
  {
    "uid": "4183899976",
    "password": "5A78FF039DF5B22F03D22691F34A1634D54BEF3A8B5FE361D80BF2B2D3BACEEE"
  },
  {
    "uid": "4183900618",
    "password": "143EAE3272B4D4D2401DCA37E9AF8F99A2D8F764E6340A282E1BF99E333EA2B1"
  },
  {
    "uid": "4183901314",
    "password": "98A502D194650858FF5868DE94DD9DDBFCE0425DF1F03E16AFD451E8BDAD033B"
  },
  {
    "uid": "4183901906",
    "password": "AA5925AE493E25BD16BCB78C68728A8E1F6439D8A1E558A1521BCCEE20FD6269"
  },
  {
    "uid": "4183902618",
    "password": "F368CF4172F796E489D21B39E43E6D8C315DBC9989C3A956285A53A209080E52"
  },
  {
    "uid": "4183903287",
    "password": "B7E1DD52E594725338A4BB01BB441BA8A83B5229A8BF20757F300936ACA845B8"
  },
  {
    "uid": "4183903962",
    "password": "F135B7B0BA43B4C2519F3E442352D10A4A6C1C2424BF82575456B4A644CCE88C"
  },
  {
    "uid": "4183905077",
    "password": "5223212DF8FCC64C6E23EFA65CE7CEC45D1E8D5BE2B2C918998B1B84653C52C3"
  },
  {
    "uid": "4183905882",
    "password": "97F01079E93458599A57D934B25438033BDE1876E8A574BBF78FED43FB49F175"
  },
  {
    "uid": "4183906851",
    "password": "91FB81F11D586F203E642E1231311FD945EF2F2F2B60D6DE99C6F421414B5615"
  },
  {
    "uid": "4183908851",
    "password": "6AEAE38BB1F4F5DE9407A8C986C29B2DEF9DA7B947B02EDB6C30AE9E7F133497"
  },
  {
    "uid": "4183910660",
    "password": "98428121E638C5528AA8C8CA1DEBCEEACBA4286DC48D70C91A5CAD6A7A652C71"
  },
  {
    "uid": "4183911399",
    "password": "E6C7E978E36513666D4D96E4A7FE8D69AC4CEDB22926C334095A361A9E8D7AC0"
  },
  {
    "uid": "4183912253",
    "password": "355674033FDDA8606FEB51C794FCEC6043E5228F22D4C4148288E0EA0373A7C5"
  }
];
    
    logger.info(`Using ${hardcodedAccounts.length} hardcoded guest accounts`);
    return hardcodedAccounts;
  }

  generateJWT(guestAccount) {
    const payload = {
      account_id: this.generateAccountId(),
      nickname: this.generateNickname(),
      noti_region: "BD",
      lock_region: "BD",
      external_id: this.generateExternalId(),
      external_type: 4,
      plat_id: 1,
      client_version: "1.108.3",
      emulator_score: 100,
      is_emulator: true,
      country_code: "SG",
      external_uid: parseInt(guestAccount.uid),
      reg_avatar: 102000007,
      source: 4,
      lock_region_time: Math.floor(Date.now() / 1000),
      client_type: 2,
      signature_md5: "",
      using_version: 1,
      release_channel: "3rd_party",
      release_version: "OB50",
      exp: Math.floor(Date.now() / 1000) + (4 * 60 * 60) // 4 hours from now
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      algorithm: 'HS256',
      header: {
        alg: "HS256",
        svr: "1",
        typ: "JWT"
      }
    });

    return {
      token,
      payload
    };
  }

  generateAccountId() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  generateNickname() {
    const prefixes = ['Anta', 'Gunn', 'Micro', 'Soot', 'Joe', 'Beat', 'Pard', 'Rick', 'Nite', 'Bon', 'Lily', 'Gyro', 'Razor', 'Fall', 'Ash', 'Fish', 'Orca', 'Note', 'Merc', 'Anya', 'Mary', 'Mutant', 'Mole', 'Mess', 'Whiz', 'Poe', 'Fish', 'Retro', 'Cherub', 'Nug', 'Emi', 'King', 'Fry', 'Elk', 'Bone', 'Seal', 'Mantis', 'Retro', 'Note', 'Ave', 'Bone', 'Note', 'Path', 'Tacit', 'Star', 'Paige', 'Guy', 'Halo', 'Knee', 'Note', 'Fang', 'Note', 'Song', 'Cobalt', 'Note', 'Neo', 'Perma', 'Tee', 'Roll', 'Love', 'Note', 'Heavy', 'Path'];
    const suffixes = ['4?0r9O', '1v4n5', 'op0o1L5', '3t7m1)7_', '2p2F3', '1O6x0m', '7!2f4I', '9M7y2t4Y', 'N42aT4(9Z', '2@7n8s8', '8i1l0!', '2Q6X2x1d', '1Y4O2a1', '9T0x2X2l', '4a3f3fbc7', '3S6W4!0', '7F3M0T', '1@8a1w9', '9@6', '4bfa4af4de', '23562cb2f9', '0@4@3V5', '0n5E5', '6P6!2', '0Y2j1D1_0', '6a2j4B', '9k3G5&3', '8k7G5&3', '7j4N0T', '6s0a8R', '1o2b9', '8y4B', '9X9z4', '0B9t8', '7I3m7U', '0a9b97f', '9X9s4', '1q1D9Q', '3y1q4', '6n6O2', '9D0f9', '2q!3t6s6', '1a1l7Y', '0a9b97f', '9X9s4', '1q1D9Q', '3y1q4', '6n6O2', '9D0f9', '2q!3t6s6', '1a1l7Y'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  }

  generateExternalId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async generateAllTokens() {
    try {
      logger.info('Starting JWT token generation...');
      const guestAccounts = await this.loadGuestAccounts();
      const generatedTokens = [];

      for (const account of guestAccounts) {
        const { token, payload } = this.generateJWT(account);
        generatedTokens.push({ token });
      }

      // Save generated tokens
      await fs.writeFile(
        this.generatedTokensPath,
        JSON.stringify(generatedTokens, null, 2)
      );

      logger.info(`Generated ${generatedTokens.length} JWT tokens`);
      return generatedTokens;
    } catch (error) {
      logger.error('Error generating tokens:', error);
      throw error;
    }
  }

  async getGeneratedTokens() {
    try {
      const data = await fs.readFile(this.generatedTokensPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error loading generated tokens:', error);
      return [];
    }
  }
}

module.exports = new JWTService();
