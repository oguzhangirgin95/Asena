package com.asena.framework.controller;

import com.asena.framework.dto.TokenRequest;
import com.asena.framework.dto.TokenResponse;
import com.asena.framework.security.JwtTokenProvider;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/token")
    public TokenResponse token(@RequestBody TokenRequest request) {
        TokenResponse response = new TokenResponse();
        response.setToken("mD9qNlxdNrN9bptFQywR");
        response.setEncryptionKey("Srh8xh2Qc/33z4KC4Rt3bPqTBEZCt4wRJpOiqMlHADI=");
        response.setExpiresIn(600);
        response.setBeforeLoginTimeout(900);
        response.setExpiresInWarning(20);
        response.setCurrentTime("2026-01-03T23:05:34.6051473+03:00");
        response.setCheckMsisdn(false);
        response.setTimeout(5);
        response.setMainPageCacheTimeout(60);
        response.setIsNotificationMenuVisible(true);
        response.setIsQrMenuVisible(true);
        response.setCardImageCacheLastFlushDate("19112019");
        response.setIsChatBotVisible(false);
        response.setBackgroundImages("");
        response.setCurrentBackgroundImage("");
        response.setClientShowPageDefinitions("abroadtransactionconfirm,accountclosing,accountdetails,accountmovements,accountsall,accounttrackingrestriction,accumulatefund,accumulategold,accumulateupdate,additionalcardcancel,additionalposapplication,additionalposapplicationcancel,advantagepackageapply,advantagepackagechoosing,allstatements,apiauthorization,apitracingcancel,applicationcancellation,applicationfollow,applycredit,applyhgs,applyogs,approvecanceltransactionsmonitoring,arbitrajtransaction,assetreconciliation,authorizationlevels,authorizationmonitoring,authorizationprocedures,automaticinstallment,automaticinstallmentcancel,automaticpayinstruction,automaticpaymentorder,automaticpayments,automatictaxpayment,axacancel,axainsuranceapplication,banktocompanyfiletransfertransaction,blockeddemandaccountsinsertdelete,bonusbusinesscardapplication,bonuspointtransactions,bonuspointtransfer,businesscardcanceltransaction,businessintermrecords,buyforeigncurrencytransaction,buyfunds,buysellstockchaintransaction,callcenter,callcenterpassword,campaign,campaigninfo,cancelcaptainaccount,captainaccountapplication,cardapplicationselectcard,cardautomaticpaymentcancel,cardautomaticpaymentorder,companytobankfiletransfertransaction,cardautomaticpaymentupdate,cardclosure,carddebtsafe,cardlist,cardstatementtypechange,cardtransactionrestriction,cashadvance,changecardpassword,changecreditcardstatementdate,changeinternetbankingpassword,changeprepaidcardpassword,changestatementdate,checkingaccountopening,chequebookrequest,chequetransactions,companydealerpayment,companyinformation,compliancetest,confirmationtransactions,consumerfinancing,contactinformation,contactpreferences,contactus,contractselection,createnewuser,creditcancel,creditcanceltransaction,creditcardapplicationcancel,creditcarddetails,creditcardlimithistory,creditcardlimitrequest,creditinstallmentpayment,creditsdetail,creditwithdrawal,customsdeclaration,dailystockportfolio,dashboard,dealerchequequery,dealerlimitinquiry,dealerlimitinquirydetail,dealertransactions,debitadditionalcardcancel,debitcardapplication,companytobankfiletransfertransaction,debitcardcancel,debitcardlimitupdate,debitcardupdate,debtpayment,denizaccount,denizleasing,denizleasingdetail,depositfundaccount,easyaddress,edepositaccount,eftfromswapaccount,expediencytest,expenseobjection,exporttransactiondetails,exporttransactionlist,exporttransactionssearchwithdetail,extendedcardlimitrequest,extractinstallmentapplytransaction,extractinstallmenttransaction,factoringeventtracing,factoringfiletransaction,factoringtransaction,fastpaymovementtracking,favoritecontractdefinition,fcfilemonitoring,fcfileupload,filecancellationcancel,filecancellationtracing,filemonitoring,fileupload,financialsummary,firstlevel,foreigncurrencytransaction,forgottenpassword,fundcancel,fundmonitoring,fundportfolio,gamesofchancepayment,getbondsandbillstransaction,getforeigncurrencytransaction,getrepo,getstockcertificatetransaction,goldenorsilvertrading,hgscancel,hgsogschoosing,hgspaymentinfo,homecredit,homepage,importstransactiondetails,importstransactions,importstransactionssearchwithdetail,informationtracing,installment,installmentadvancecancel,installmentcashadvancecanceltransaction,installmentclosingearlypayment,installmentcommercialloancancel,installmentoverdraftaccount,installmentoverdraftaccountinfo,installmentscashadvance,installmentskmhcancel,insuranceapplicationmainpage,insurancedetails,insurancemakechanges,insurancetransactions,intermrecords,intrabankregularpaymentorder,intrabanktoownaccount,investmentcontracts,invoiceandpaymentselection,kbgmonitoring,kgbcancel,kkbchequereport,kkbreport,kmhapplication,kmhcanceltransaction,letterofcredittracing,letterofcredittransactions,leveragefxdepositsending,limitrequestcancel,logout,lostcardnotification,maincompanytransactions,maintransactioninsertinvoiceandwaybill,makedonation,manufacturercardapplicationcancel,manufacturercardlimitapplicationcancel,merchantapplicationcancel,merchantcancel,merchantcardcredit,merchantcardinstallment,merchantturnoverreport,metlifecancel,metlifeinsuranceapplication,mobilephonepayment,mobilesignatureapplication,mobilesignaturesettings,moneydrawableaccount,moneygramcancel,moneygramgetmoney,moneygramtransactions,moneytransfertoanotheraccount,movementinquiry,municipalitypayment,mybondsbillsportfolio,mycredits,mydocuments,myprofile,mystockcertificates,ogscancel,onenightdepositaccount,opendepositaccount,openinvestmentaccount,openleveragefxaccount,openmobilesignature,openviopaccount,overdraftapply,packageoperations,passwordchange,pastfiletransfers,paydebttoanothercreditcard,paydebttobusinesscard,paydebttoowncreditcard,paydebttoproducercard,paydebttowncreditcard,paykmhtobusinesscard,periodaccount,personalfinancecredit,personalinformation,personalmenu,portfolioinquiry,postransactions,posunblocking,privatepensioncontract,producercardapplication,producercardbonuspointtracing,producercardcredit,producerfurthertransactions,producerintermrecords,promissorynotelist,publicdemand,publicdemandcancel,publicdemandfunds,questionchange,recipients,recipientsmanagement,regularpaymentordertootheraccount,reports,restrictipandiss,restrictiporissmanagement,restricttime,restricttimemanagement,retirementaggrements,retirementdetail,retirementforms,salaryfilemonitoring,salaryfileupload,salestockcertificatetransaction,schoolpayment,screenlist,searchreceipt,securitiesmovements,securityquestion,sellbondsandbillstransaction,sellfunds,sendtoapprovetransactions,sessionchange,sessiondurationrestriction,sgkpayment,showbusinessinstallment,showbusinessstatement,showinstallment,showproducercardinstallment,showproducerstatement,showstatement,smecardapplication,smsbanking,smsotp,smsverification,standingorderoperations,statementinstallmentcancel,statementinstallmenttracking,statementinstallmenttrackingresult,stockcreditapply,stockexchangeonlinetransaction,stocksaccountmovements,supplementarycardapplicationforcreditcard,supplementarycardapplicationfordebitcard,supplementarydebitcardupdate,swapaccounteft,swiftmessage,swifttransactions,taxautomaticpayments,taxpayment,terminalcancel,tradecredit,tradekmhapply,transactioninquiry,transactionlimitrestriction,transportationcardpayment,unblockingsimcard,updateinformation,updatetaxautomaticpayment,uploadmoney,useloancancel,usepersonalfinancecredit,vehiclecredit,vioporderentry,viopportfolio,virtualcardcancellation,virtualcardcreation,virtualcardlimitupdate");
        response.setActiveVersions(Arrays.asList(
            10L, 1L, 1029809L, 1122126L, 122288L, 128377L, 1477481L, 1477482L, 16122025L, 16993L, 1718688L, 18122024L, 1827856L, 1873462L, 18937L, 1928778L, 193042L, 1948611L, 1966707L, 1970732L, 1971450L, 1984806L, 1987306L, 1990507L, 1998318L, 1999941L, 2005006L, 2007013L, 20250724L, 20250820L, 20251113L, 2033256L, 2042874L, 2055107L, 2056149L, 2057146L, 20694L, 2072954L, 2073202L, 2079116L, 21032L, 227102025L, 26021L, 26040L, 26323L, 30092025L, 30766L, 40488L, 40546L, 41706L, 41748L, 42153L, 48035L, 50681L, 52602L, 55101055L, 55101056L, 55101061L, 5572462L, 58618L, 65493L, 67214L, 67482L, 74449L, 9092025L, 90920255L, 9130825L, 914925L, 915043L, 91722863L, 924154L, 924586L, 926234L, 931820L, 9363142L, 947067L, 9470671L, 948156L, 9481561L, 963191L, 9631919L, 967648L, 969881L, 9796748L, 99080225L, 9911384L, 991210L, 9912701L, 991280107L, 9914102025L, 9916052025L, 991661324L, 991662494L, 991742L, 992008801L, 992011819L, 99215299L, 9924441L, 99262341L, 992661L, 9927371L, 99280825L, 9928866L, 9930139L, 9931124L, 9931692L, 9931941L, 9932475L, 9932993L, 9933301L, 9933559L, 9935751L, 9937399L, 9937413L, 9941384L, 9943253L, 994325399L, 9943259L, 9943260L, 9946197L, 9948035L, 9949157L, 995020L, 9950718L, 99507181L, 99509299L, 9951046L, 99510466L, 99517L, 995256699L, 9955611988L, 995751L, 9959739L, 9963547L, 9964133L, 99641336L, 99641337L, 99641338L, 99641339L, 996557L, 9967189L, 9967479L, 9967481L, 9967934L, 9969881L, 9974038L, 9980782L, 998083L, 9984579L, 9984932L, 9985199L, 9986034L, 99860349L, 99904112025L, 99912112024L, 99926112925L, 99926234L
        ));
        response.setIsLoadTestRefererShow(false);
        response.setSessionName("EKİM");
        
        return response;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        // Mock authentication
        String username = credentials.get("username");
        // In a real app, validate username/password here
        
        String token = jwtTokenProvider.generateToken(username);
        return Map.of("token", token);
    }
}
