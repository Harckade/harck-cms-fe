import React from 'react';
import {ImFilePicture, ImFilm, ImFilePdf, ImFileEmpty, ImFileText2, ImFileZip, ImFileWord, ImFileOpenoffice, ImFileExcel, ImFileMusic, ImFolder} from 'react-icons/im';
import {FaRegFilePowerpoint} from 'react-icons/fa';
import {BsFileCode, BsCalendar2Week} from 'react-icons/bs';
import {AiOutlineCode} from 'react-icons/ai';
import {VscJson} from 'react-icons/vsc';

export const FileIcon = ({file}) => {
    const fileName = file.name.toLowerCase();
    const fileType = file.fileType;
    const checkExtension = (extension) => {
        if (fileName.endsWith(`.${extension}`)){
            return true;
        }
        return false
    }

    const isWordFormat = () => {
        const wordExtensions = ["doc", "docm", "docx", "dot", "dotm", "dotx"];
        return wordExtensions.filter((ext) => checkExtension(ext) === true).length >= 1;
    }

    const isExcelFormat = () => {
        const wordExtensions = ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xlam", "xla", "xlw", "xlr"];
        return wordExtensions.filter((ext) => checkExtension(ext) === true).length >= 1;
    }

    const isPowerPointFormat = () => {
        const pptExtensions = ["pptx", "pptm", "ppt", "xps", "potx", "potm", "potm", "thmx", "ppsx", "ppsm", "pps", "ppam", "ppa", "odp"];
        return pptExtensions.filter((ext) => checkExtension(ext) === true).length >= 1;
    }

    const isSourceCodeFormat = () => {
        const sourceCodeExtensions = ["aspx", "do", "jsp", "ser", "gcode", "s", "aia", "ino", "ino", "xml", "php", "atomsvc", "rpy", "rdf", "o", "jad", "c", "jsf", "asp", "asm", "htm", "sh", "mrc", "lxk", "h", "r", "py", "lib", "c3p", "bas", "p", "toml", "action", "js", "pdb", "abs", "rpyc", "rcc", "pod", "sln", "asta", "cpp", "pl", "faces", "lua", "fs", "m", "luac", "bat", "vbs", "mom", "cs", "sasf", "gradle", "src", "cfm", "html5", "scb", "ss", "ejs", "asi", "pyc", "ws", "arxml", "sal", "luca", "xla", "mf", "mst", "idb", "rss", "mac", "mlx", "dtd", "ins", "graphml", "mm", "mdp", "ptx", "liquid", "prg", "xsd", "c#", "fmb", "jsc", "ips", "perl", "axd", "pickle", "bp", "smali", "nupkg", "tcl", "f", "spr", "yaml", "jdp", "gp", "derp", "java", "scs", "e", "mwp", "cls", "inc", "ema", "mrl", "cc", "mc", "wbf", "csproj", "d", "fas", "resources", "bash", "wbt", "scss", "fil", "cgi", "ckm", "yyp", "txx", "dbg", "jav", "ave", "swift", "wiki", "atp", "csb", "cod", "brml", "pmp", "dvb", "beta", "vls", "history", "l", "jsa", "bal", "cmake", "rpg", "asic", "go", "bml", "run", "pf3", "install", "pm", "rss", "cms", "loc", "sfx", "io", "agc", "vlx", "pyt", "cpb", "stm", "x", "matlab", "pyo", "isa", "ipr", "mzp", "sax", "resx", "eaf", "pas", "eld", "mhl", "prl", "sct", "mvba", "csc", "v4e", "kt", "xsl", "rbf", "re", "gbl", "xlm", "coverage", "lap", "ipb", "psm1", "arb", "rc", "vbe", "dsd", "nvi", "lsp", "sm", "geojson", "ebc", "hbs", "ml", "lmp", "form", "mq4", "xaml", "rfs", "nt", "pdml", "hs", "vba", "mhm", "plx", "vcxproj", "sl", "gv", "aps", "a5r", "nse", "xcp", "vip", "dist", "cxx", "ptxml", "scpt", "ti", "pjt", "bdt", "jse", "phl", "c++", "mrd", "lis", "moc", "wdl", "mlv", "ppam", "groovy", "phtml", "cpr", "classpath", "mfa", "rpym", "inp", "tra", "ptl", "vbp", "rb", "mw", "seam", "command", "script", "login", "el", "pbl", "as", "rbt", "ats", "mq5", "lub", "dbml", "csx", "bbc", "dtx", "jsdtscope", "txml", "pag", "dlg", "vd", "bcp", "rml", "gs", "dep", "proto", "build", "trig", "dwt", "ppa", "xcl", "datasource", "less", "j", "au3", "lss", "lol", "thtml", "isu", "rh", "lpx", "jsx", "xslt", "cspkg", "rule", "mo", "jl", "nbk", "pyw", "vbi", "aidl", "gcl", "uix", "wsdl", "ps1", "mkb", "bxml", "pbxproj", "ipf", "gnt", "kd", "ahk", "fwx", "hpf", "vb", "diff", "cson", "twig", "shfbproj", "dpr", "vcp", "btq", "dqy", "bsc", "f90", "qry", "srz", "pbl", "cml", "mg", "tpl", "dbp", "exp", "bb", "hxp", "lisp", "cbl", "arq", "mrs", "jbi", "psd1", "mk", "hdf", "cg", "scb", "gch", "pyx", "mak", "tru", "dev", "styl", "qs", "asz", "uvproj", "odc", "mec", "kts", "lnk", "dproj", "bgm", "kmt", "wml", "depend", "dts", "lst", "hkp", "factorypath", "ssi", "jade", "pch", "egg-info", "dpk", "lds", "textile", "aiml", "vpc", "axs", "master", "tmh", "cobol", "tpm", "nk", "tkp", "zrx", "obj", "ada", "owl", "pxml", "hx", "gypi", "brs", "kv", "pli", "mel", "akt", "cos", "dbmdl", "amw", "cpz", "xui", "ror", "bmo", "rob", "coveragexml", "edml", "bax", "cob", "pl", "idl", "dso", "sca", "mscr", "scala", "sdl", "hlsl", "a2w", "ocb", "param", "wsf", "abap", "btproj", "irb", "greenfoot", "htc", "cp", "svn-base", "rc2", "xme", "clm", "rhtml", "cbp", "bcc", "ary", "zpd", "scr", "cx", "dob", "tcz", "apb", "uvprojx", "rkt", "vbscript", "zsc", "wsdd", "targets", "qvs", "ssq", "tgml", "jml", "lba", "sxs", "pym", "gss", "ecore", "ttl", "vbx", "gml", "awd", "sass", "bur", "cbs", "rej", "ksh", "xul", "dhtml", "inp", "kst", "tik", "wxs", "poc", "jardesc", "asc", "xn", "cgx", "cuh", "htr", "dpd", "wfs", "din", "jsonp", "fdt", "shit", "fountain", "irobo", "xbs", "wpk", "4ge", "vjp", "ulp", "m6m", "vbw", "rts", "odl", "ncb", "gyp", "ksc", "gfa", "mod", "tk", "dic", "trt", "dto", "zws", "wxl", "vup", "thor", "clw",
                                      "jcw","a","m","opl","viw","xpb","vap","pdo","opv","bsv","mat","pkb","ebx","mfl","rproj","wsc","devpak","fxml","dfb","fsi","xjb","frt","jks","xproj","bzs","g1m","tea","php3","mx","xin","sqlproj","irc","rpo","mediawiki","hms","hic","ogx","scm","ppml","ash","obj","appxmanifest","nhs","lnx","vim","exe_","iml","gsk","kx","vc6","mls","msha","ph","txl","fxl","cla","dfd","bpo","autosave","dgml","eze","cba","osg","ide","agi","m51","coffee","jacl","gls","common","bet","dot","d4","airi","s","hoic","clojure","ctl","wpj","sami","kex","tdo","prg","geany","xib","msc","ccs","vbhtml","xr","cxs","robo","applet","f95","lnp","cxe","rws","vstemplate","ipy","ascx","svo","qsc","enml","vrp","pou","fsx","cshrc","s5d","ghp","ii","jcl","jsfl","lmv","jtb","bpr","ftn","ig","sbr","cod","rbw","vbproj","jak","vcproj","snippet","mako","xnf","xpdl","rptproj","swg","fbp","v","hxx","atmn","smw","oppo","fcmacro","fgb","ppo","ucb","zero","rdf","pnproj","kodu","lhs","ogr","bxl","slim","cfi","pdb","cls","okm","vpi","p6","make","res","rub","gek","tur","tlh","dba","appxupload","sno","ncx","appxsym","j3d","jex","cplist","rmn","ipch","sltng","ev3p","gus","cel","wxi","plog","chef","vddproj","vdp","myapp","pba","hse","cgi","ttcn","hei","lsh","ilk","npi","vbg","rgs","xda","bbf","wsh","win32manifest","mly","phs","ump","tql","actionscript","mod","alan","jgs","wmw","ebs2","fsproj","psc1","cls","psml","xml-log","xfm","phps","pl7","rrc","vsmacros","gobj","ps2","makefile","cfo","jcs","mbas","jss","cs","vdproj","ogs","gfe","wpm","sus","amos","classdiagram","was","lml","gxl","s43","psl","autoplay","fpi","c--","csh","pbi","cfs","bsh","xlv","zpl","mpx","rs","ccproj","xsql","sas","scm","scz","prg","frs","pgm","wli","maki","ox","tsq","bms","fcg","hbm","grxml","afb","rdoc","m3","phpt","ba_","xig","ebs","m4","resjson","vssscc","bsml","asmx","sjc","nbin","xtxt","com_","v3s","haml","a3c","cd","csh","ew","hsm","c__","ses","m2r","ex","bs2","appcache","bdh","pmod","tli","orl","ji","fasl","oqy","nlc","ttinclude","stl","xv2","sqo","pql","bxp","clj","itcl","brx","tikz","thml","sbh","pl6","wbc","rpres","mash","hrl","hxproj","exw","ob2","hom","maml","ekm","anjuta","bhs","nmk","p5","qpf","fcgi","pspscript","itmx","mc","php1","ywl","jbp","ck","zfd","hxa","ane","owl","mcp","hbx","acu","saas","rbp","msl","tcsh","git","nas","tzs","fuc","mb","vtm","qxm","kix","hla","rnw","pr7","awk","iap","dlg","idle","~pa","pf1","4pk","ked","pom","simba","aml","bml","wdproj","s4e","jsb","mcml","nls","exu","ik","ogl","pb","bin_","mqt","iss","syp","astx","ins","ju","pro","cphd","rxs","psu","mss","avsi","mss","pri","pkh","glade","acgi","php2","4gl","b24","tla","gc3","jug","c86","arnoldc","gdg","jsh","entitlements","kcl","bte","mfps","kon","ebs","wdw","rc3","pawn","bsm","ipf","buildpath","mnd","mmh","scar","licx","qac","rvb","xrc","ldz","hc","licenses","wam","f03","kit","sbml","zts","javajet","jcm","obr","gemfile","owx","ago","fus","uih","chh","lsp","zsh","hxml","pwo","axb","ass","aem","rbx","dcf","udf","11","ssc","gvy","xblr","xojo_binary_project","jsxinc","pp1","rqc","dml","neko","b2d","cfml","scriptterminology","reb","a2x","rqb","cord","a8s","for","ms","mxe","asax","a66","dsb","vsixmanifest","ts0","komodo","vala","exsd","cgvp","dse","mdex","mmbas","vgc","jxl","pfa","confluence","napj","xje","ajm","graphmlz","19","slackbuild","rake","wspd","lamp","csml","res","goc","nunit","ss",
                                      "pjx","asp","ahtml","mmb","daemonscript","map","yxx","mln","ezg","exp","rqy","image","php6","mlsxml","mrm","xba","mdf","configure","po","csm","as3","ebm","xbap","xqr","bxb","has","msh1xml","triple-s","bufferedimage","dbpro","ccbjs","jscript","pro","applescript","pl5","fmx","defi","creole","hhh","ssml","lbj","p4a","wdk","litcoffee","hrh","genmodel","irbrc","tec","builder","eek","nbk","pf0","kbs","xmla","elc","dtml","f77","plc","h6h","zpk","ht4","~df","clw","cr","ghc","inc","ecorediag","xoml","ls3proj","jmk","s2s","d2j","pf4","xcodeproj","dsq","rvt","opx","lasso","dor","nsi","csi","spr","fbp6","wcm","generictest","aah","xbl","fwactionb","kumac","dbproj","sdsb","dwarf","capfile","vc15","skp","php5","vps","epl","ccp","pm6","tmo","uem","dsr","pgm","wis","wax","lsxtproj","borland","shfb","jgc","clips","xpgt","dht","dwp","nspj","js","nes","iss","a","tiprogram","con","fzs","xql","fxh","rsp","csp","avc","clp","pfx","swt","rrh","dsym","dsp","vsprops","cl","actproj","arscript","mvpl","usp","poix","lpr","dfm","iwb","zcode","zbi","hay","smm","a3x","es6","atmx","mpm","bsh","actx","uit","ice","qdl","msil","sdi","dcproj","tplt","aplt","cpy","netboot","judo","zh_tw","tcx","vxml","cya","il","tcz","xap","mfcribbon-ms","sit","gml","fsb","f","xlm_","tsc","bcf","galaxy","fdo","bdsproj","sjs","aar","pf2","hh","tab","sb","dcr","sct","spx","kl3","cu","fxcproj","playground","pike","textile","synw-proj","jpx","b","lib","psc2","phpproj","ix3","sbs","pas","docstates","kml","rpj","mcp","mtp","snp","89x","nokogiri","pbp","mex","ps2xml","vic","cnt","acm","fpc","a86","hpp","wzs","dsym","dia","xsc","pgml","gsc","sxv","sce","deb","pem","pm5","vce","abl","script editor","p","jetinc","msh2xml","abs","ijs","pls","module","php4","cls","sci","lols","tst","pp","beam","frj","wod","aks","xys","rbx","qlm","sdef","zs","mke","io","usi","is","cap","ddp","ipp","mcw","policy","asc","akp","dsa","drc","pdb","apt","vc5","es","chd","gld","sts","inc","lrf","msvc","lbi","gml","simple","zsc","qlc","sxt","sml","sconstruct","mmch","8xk","gst","pcd","dd","hsc","gla","wbs","h__","h2o","xamlx","njk","b","cla","dxl","pd","pc","cola","class","rsl","pdl","wmlc","dpr","lp","pf?","rfx","ctp","rpp","lo","oplm","rbs","dbo","w","dms","vc","fscr","npl","aep","jpage","mscr","rb","robo","mdp","wdi","ls1","ptl","wmls","js","rip","xhtm","4th","rakefile","ccp","dt","sc","kpl","i","avs","dg","apg","i","mdp","mcr","ml","rexx","dcf","aro","cod","z","an","vss","mi","plx","tld","mmjs","rprofile","aml","cxl","wmlsc","lng","con","c","snapx","cas","dmb","fbz6","hbz","sc","tpr","psf","msh2","pl1","msdl","rpg","scp","ow","ocr","f40","cod","ebuild","mm","mingw32","msh1","m4x","ssc","spt","ifp","pdl","alg","asproj","hcw","mbtemmplate","gsb","jpd","magik","a51","armx","sfl","yml2","ds","axe","cr2","dro","bps","mbs","nnb","rsm","cs","c","t","app","mab","ccxml","nj","wsd","sma","dpr","cp","scptd","asbx","dts","pxd","src","pde","exv","rtml","src","hydra","wscript","text","osas","asm","art","dmc","tmf","cljs","jlc","owd","sfm","slt","wpm","lds","ccs","texinfo","zcls","odh","jsm","ad2","csdproj","mbam","fmt","ff","dwt","mpd","rb","svc","qx","dml","fsproj","nrs","dgsl","fsf","nxc","cb","abc","cal","msm","alx","androidproj","vfproj","asf","asr","m","vpl","fdml","mingw","pjt","rb","mli","lrs","h--","ixx","fgl","py","vc7","wch","smx","sf","pm","eqn"];
        return sourceCodeExtensions.filter((ext) => checkExtension(ext) === true).length >= 1;
    }

    if (fileType === 'image')
        return <ImFilePicture />
    else if (fileType === 'video')
        return <ImFilm />
    else if (fileType === 'audio')
        return <ImFileMusic />
    else if (fileType === 'pdf')
        return <ImFilePdf />
    else if (fileType === 'folder')
        return <ImFolder className="filemanager-folder"/>
    else if (checkExtension("txt"))
        return <ImFileText2 />
    else if (checkExtension("zip"))
        return <ImFileZip />
    else if (isWordFormat())
        return <ImFileWord />
    else if (isExcelFormat())
        return <ImFileExcel />
    else if (checkExtension("odt"))
        return <ImFileOpenoffice />
    else if (isPowerPointFormat())
        return <FaRegFilePowerpoint />
    else if (isSourceCodeFormat())
        return <BsFileCode/>
    else if (checkExtension("exe"))
        return <AiOutlineCode/>
    else if (checkExtension("json"))
        return <VscJson/>
    else if (checkExtension("ics"))
        return <BsCalendar2Week/>

    return <ImFileEmpty />
}