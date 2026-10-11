/* Preparation guides, reviewed 11 October 2026. Conditional requirements are
   deliberately labelled; these lists do not replace the Gujarat RTO's checklist. */
(() => {
  'use strict';
  const pair = (en, gu) => ({ en, gu });
  const rc = pair('Vehicle Registration Certificate (RC).', 'વાહનનું રજીસ્ટ્રેશન સર્ટિફિકેટ (RC).');
  const insurance = pair(
    'Current vehicle insurance certificate.',
    'વાહનના હાલના વીમાનું પ્રમાણપત્ર.'
  );
  const puc = pair(
    'Valid PUC certificate, where applicable to your vehicle.',
    'તમારા વાહનને લાગુ પડતું હોય તો માન્ય PUC પ્રમાણપત્ર.'
  );
  const identity = pair(
    'Accepted identity and address proofs; confirm the accepted documents with the adviser.',
    'માન્ય ઓળખ અને સરનામાના પુરાવા; સ્વીકાર્ય દસ્તાવેજો સલાહકાર સાથે નક્કી કરો.'
  );
  const photo = pair(
    'Photograph and signature, if requested by the application portal.',
    'અરજીના પોર્ટલ પર માગવામાં આવે તો ફોટો અને સહી.'
  );
  const receipts = pair(
    'Application acknowledgement, payment receipt and appointment slip, if already issued.',
    'અરજીની પહોંચ, ચુકવણીની રસીદ અને મુલાકાતની સ્લિપ, જો મળી હોય.'
  );
  const medical = pair(
    'Physical-fitness declaration (Form 1) and medical certificate (Form 1A), as applicable to your age and licence category.',
    'તમારી ઉંમર અને લાયસન્સના પ્રકાર પ્રમાણે શારીરિક યોગ્યતાની સ્વઘોષણા (ફોર્મ 1) અને તબીબી પ્રમાણપત્ર (ફોર્મ 1A).'
  );
  const tax = pair(
    'Tax-payment records and any clearance requested for a commercial vehicle.',
    'ટેક્સ ભર્યાની રસીદો અને વ્યવસાયિક વાહન માટે માગવામાં આવેલી ક્લિયરન્સ.'
  );
  const licence = pair(
    'Existing driving licence or its number and a copy, if available.',
    'હાલનું ડ્રાઇવિંગ લાયસન્સ અથવા તેનો નંબર અને ઉપલબ્ધ હોય તો નકલ.'
  );
  const newAddress = pair(
    'Accepted proof of your new address.',
    'તમારા નવા સરનામાનો માન્ય પુરાવો.'
  );
  const forms = 'https://parivahan.gov.in/parivahan/en/content/download-forms';
  const sarathi = 'https://sarathi.parivahan.gov.in/';
  const vahan = 'https://vahan.parivahan.gov.in/vahanservice/';
  const source = (label, url) => ({ label, url });
  const guide = (name, items, sources, note) => ({
    name,
    items,
    sources,
    note:
      note ||
      pair(
        'Confirm the final document list with your adviser before visiting.',
        'મુલાકાત પહેલાં દસ્તાવેજોની અંતિમ યાદી તમારા સલાહકાર સાથે નક્કી કરો.'
      )
  });
  const guides = {
    registration: guide(
      pair('New vehicle registration', 'નવા વાહનનું રજીસ્ટ્રેશન'),
      [
        pair(
          'Registration application (Form 20) and dealer sale certificate (Form 21).',
          'રજીસ્ટ્રેશન અરજી (ફોર્મ 20) અને ડીલરનું વેચાણ પ્રમાણપત્ર (ફોર્મ 21).'
        ),
        pair(
          'Manufacturer roadworthiness certificate (Form 22; Form 22A for separately built bodies where applicable).',
          'ઉત્પાદકનું રોડવર્થિનેસ પ્રમાણપત્ર (ફોર્મ 22; અલગથી બનાવેલી બોડી માટે લાગુ પડે તો ફોર્મ 22A).'
        ),
        pair(
          'Dealer invoice and temporary registration details, if issued.',
          'ડીલરનું બિલ અને આપવામાં આવ્યું હોય તો કામચલાઉ રજીસ્ટ્રેશનની વિગતો.'
        ),
        insurance,
        identity,
        pair(
          'PAN or applicable declaration, and financier documents/Form 34 if the vehicle is financed.',
          'PAN અથવા લાગુ પડતું ઘોષણાપત્ર, અને વાહન લોન પર હોય તો ફાઇનાન્સરના દસ્તાવેજો/ફોર્મ 34.'
        ),
        receipts
      ],
      [source('Parivahan — registration forms', forms)],
      pair(
        'Imported vehicles, commercial vehicles and separately built bodies can need additional certificates. Ask before preparing your application.',
        'આયાતી વાહનો, વ્યવસાયિક વાહનો અને અલગથી બનાવેલી બોડી માટે વધારાનાં પ્રમાણપત્રો જરૂરી હોઈ શકે છે. અરજી તૈયાર કરતાં પહેલાં પૂછો.'
      )
    ),
    ownership: guide(
      pair('RC transfer — normal sale', 'RC નામ ટ્રાન્સફર — સામાન્ય વેચાણ'),
      [
        rc,
        insurance,
        puc,
        pair(
          'Forms 29 and 30 with the relevant seller/buyer signatures.',
          'વેચનાર અને ખરીદનારની જરૂરી સહી સાથે ફોર્મ 29 અને 30.'
        ),
        pair(
          'Buyer address proof and seller/buyer identity details; PAN or applicable declaration if requested.',
          'ખરીદનારના સરનામાનો પુરાવો અને વેચનાર/ખરીદનારની ઓળખની વિગતો; માગવામાં આવે તો PAN અથવા લાગુ પડતું ઘોષણાપત્ર.'
        ),
        pair(
          'RTO NOC for an interstate transfer, and lender consent/loan-closure papers if applicable.',
          'બીજા રાજ્યમાં ટ્રાન્સફર માટે RTOનું NOC, અને લાગુ પડે તો ધિરાણ આપનારની મંજૂરી/લોન પૂર્ણ થયાના કાગળો.'
        ),
        receipts
      ],
      [
        source(
          'Parivahan — transfer of ownership',
          'https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-ownership.html'
        )
      ],
      pair(
        'This list is for an ordinary sale. Inheritance and auction transfers use different forms and supporting documents.',
        'આ યાદી સામાન્ય વેચાણ માટે છે. વારસાઈ અને હરાજીના ટ્રાન્સફર માટે જુદાં ફોર્મ અને પુરાવા જરૂરી હોય છે.'
      )
    ),
    renewal: guide(
      pair('Driving licence renewal', 'ડ્રાઇવિંગ લાયસન્સ રિન્યુઅલ'),
      [
        licence,
        pair(
          'Renewal application generated by Sarathi for Gujarat (Form 2/current prescribed application).',
          'ગુજરાત માટે સારથિ પોર્ટલથી મળતી રિન્યુઅલ અરજી (ફોર્મ 2/હાલની નિયત અરજી).'
        ),
        identity,
        medical,
        photo,
        receipts
      ],
      [
        source(
          'Parivahan — renewal of driving licence',
          'https://mparivahan.parivahan.gov.in/mstatic/english/dl-info-renewal-dl.html'
        )
      ],
      pair(
        'Medical and retest requirements depend on your age, licence category and expiry date. Your adviser will confirm what applies.',
        'તબીબી પ્રમાણપત્ર અને ફરીથી ટેસ્ટની જરૂરિયાત તમારી ઉંમર, લાયસન્સના પ્રકાર અને સમાપ્તિ તારીખ પર આધાર રાખે છે. સલાહકાર લાગુ પડતી જરૂરિયાત જણાવશે.'
      )
    ),
    learner: guide(
      pair('Learner’s licence', 'લર્નિંગ લાયસન્સ'),
      [
        pair(
          'Learner’s licence application generated through Sarathi for Gujarat.',
          'ગુજરાત માટે સારથિ પોર્ટલથી મળતી લર્નિંગ લાયસન્સની અરજી.'
        ),
        pair(
          'Accepted age/date-of-birth and address proofs.',
          'ઉંમર/જન્મતારીખ અને સરનામાના માન્ય પુરાવા.'
        ),
        medical,
        photo,
        receipts
      ],
      [
        source('Sarathi — select Gujarat for the application checklist', sarathi),
        source('Parivahan — licence forms', forms)
      ]
    ),
    permanent: guide(
      pair('Permanent driving licence', 'પાકું ડ્રાઇવિંગ લાયસન્સ'),
      [
        pair(
          'Valid learner’s licence for the vehicle class you are applying for.',
          'જે વાહનના વર્ગ માટે અરજી કરો છો તેનું માન્ય લર્નિંગ લાયસન્સ.'
        ),
        pair(
          'Driving licence application and test appointment details from Sarathi.',
          'સારથિની ડ્રાઇવિંગ લાયસન્સ અરજી અને ડ્રાઇવિંગ ટેસ્ટની મુલાકાતની વિગતો.'
        ),
        identity,
        medical,
        photo,
        pair(
          'Training certificate for a transport-vehicle licence, where required.',
          'ટ્રાન્સપોર્ટ વાહનના લાયસન્સ માટે જરૂરી હોય તો તાલીમનું પ્રમાણપત્ર.'
        )
      ],
      [
        source('Sarathi — licence application', sarathi),
        source('Parivahan — licence forms', forms)
      ],
      pair(
        'A checklist does not replace the required driving test. Confirm the test vehicle and appointment instructions separately.',
        'દસ્તાવેજોની યાદી જરૂરી ડ્રાઇવિંગ ટેસ્ટનો વિકલ્પ નથી. ટેસ્ટ માટેનું વાહન અને મુલાકાતની સૂચનાઓ અલગથી નક્કી કરો.'
      )
    ),
    'duplicate-rc': guide(
      pair('Duplicate RC', 'ડુપ્લિકેટ RC'),
      [
        pair('Duplicate RC application (Form 26).', 'ડુપ્લિકેટ RC માટેની અરજી (ફોર્મ 26).'),
        pair(
          'Police report/certificate for a lost or stolen RC; damaged RC if available.',
          'RC ખોવાઈ કે ચોરાઈ હોય તો પોલીસનો રિપોર્ટ/પ્રમાણપત્ર; ઉપલબ્ધ હોય તો ખરાબ થયેલી RC.'
        ),
        insurance,
        puc,
        identity,
        tax
      ],
      [
        source(
          'Parivahan — duplicate RC',
          'https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-duplicate-rc.html'
        )
      ],
      pair(
        'An affidavit, chassis/engine impression or additional clearance may be requested for your case.',
        'તમારા કિસ્સામાં સોગંદનામું, ચેસિસ/એન્જિનની છાપ અથવા વધારાની ક્લિયરન્સ માગવામાં આવી શકે છે.'
      )
    ),
    'duplicate-dl': guide(
      pair('Duplicate driving licence', 'ડુપ્લિકેટ ડ્રાઇવિંગ લાયસન્સ'),
      [
        licence,
        pair(
          'Duplicate-licence application and loss/damage declaration required by the Gujarat Sarathi process.',
          'ગુજરાતની સારથિ પ્રક્રિયા મુજબ ડુપ્લિકેટ લાયસન્સની અરજી અને ખોવાઈ જવા/ખરાબ થવાનું ઘોષણાપત્ર.'
        ),
        pair(
          'Police loss report, affidavit or damaged original, as requested for your case.',
          'તમારા કિસ્સા મુજબ માગવામાં આવેલો પોલીસ રિપોર્ટ, સોગંદનામું અથવા ખરાબ થયેલું મૂળ લાયસન્સ.'
        ),
        identity,
        photo,
        receipts
      ],
      [source('Sarathi — duplicate licence application checklist', sarathi)]
    ),
    fitness: guide(
      pair('Vehicle fitness certificate', 'વાહનનું ફિટનેસ સર્ટિફિકેટ'),
      [
        rc,
        insurance,
        puc,
        pair(
          'Previous fitness certificate for a renewal, if available.',
          'રિન્યુઅલ માટે અગાઉનું ફિટનેસ પ્રમાણપત્ર, ઉપલબ્ધ હોય તો.'
        ),
        tax,
        receipts
      ],
      [source('VAHAN — fitness application and appointment', vahan)],
      pair(
        'This is a visit-preparation list. The vehicle must be presented for the required inspection; the testing centre may request category-specific certificates.',
        'આ મુલાકાતની તૈયારી માટેની યાદી છે. જરૂરી તપાસ માટે વાહન રજૂ કરવું પડે છે; તપાસ કેન્દ્ર વાહનના પ્રકાર મુજબ વધારાનાં પ્રમાણપત્રો માગી શકે છે.'
      )
    ),
    noc: guide(
      pair('Vehicle NOC', 'વાહનનું NOC'),
      [
        pair('NOC application (Form 28).', 'NOC માટેની અરજી (ફોર્મ 28).'),
        rc,
        insurance,
        puc,
        tax,
        pair(
          'For transport vehicles: permit-surrender/non-coverage and challan/fitness clearances, as applicable.',
          'ટ્રાન્સપોર્ટ વાહન માટે: પરમિટ જમા કરાવ્યાનો/પરમિટ લાગુ ન હોવાનો પુરાવો અને લાગુ પડતી ચલણ/ફિટનેસ ક્લિયરન્સ.'
        )
      ],
      [source('Parivahan — NOC form', forms), source('VAHAN — NOC application', vahan)],
      pair(
        'Tell your adviser the destination state and RTO. Financed vehicles may need lender consent.',
        'સલાહકારને ગંતવ્ય રાજ્ય અને RTO જણાવો. લોનવાળા વાહન માટે ધિરાણ આપનારની મંજૂરી જરૂરી હોઈ શકે છે.'
      )
    ),
    hypothecation: guide(
      pair('Hypothecation removal', 'લોનની નોંધ દૂર કરાવવી'),
      [
        rc,
        pair(
          'Form 35 signed by the registered owner and financier.',
          'વાહનના નોંધાયેલા માલિક અને ફાઇનાન્સરની સહી સાથે ફોર્મ 35.'
        ),
        pair(
          'Lender’s loan-closure/dues-clearance letter and NOC.',
          'ધિરાણ આપનારનો લોન પૂર્ણ થયાનો/બાકી રકમ ચૂકવ્યાનો પત્ર અને NOC.'
        ),
        insurance,
        puc,
        identity
      ],
      [
        source(
          'Parivahan — hypothecation termination',
          'https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-hp-termination.html'
        )
      ]
    ),
    'address-rc': guide(
      pair('Address change — RC', 'સરનામું બદલવું — RC'),
      [
        rc,
        newAddress,
        pair('Address-change application (Form 33).', 'સરનામું બદલવાની અરજી (ફોર્મ 33).'),
        insurance,
        puc,
        pair(
          'Financier NOC if required for a vehicle with an active loan.',
          'ચાલુ લોનવાળા વાહન માટે જરૂરી હોય તો ફાઇનાન્સરનું NOC.'
        )
      ],
      [
        source(
          'Parivahan — RC address change',
          'https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-address-change.html'
        )
      ]
    ),
    'address-dl': guide(
      pair('Address change — driving licence', 'સરનામું બદલવું — ડ્રાઇવિંગ લાયસન્સ'),
      [
        licence,
        newAddress,
        pair(
          'Address-change application and acknowledgement from Sarathi.',
          'સારથિની સરનામું બદલવાની અરજી અને તેની પહોંચ.'
        ),
        photo,
        receipts
      ],
      [source('Sarathi — change-of-address application checklist', sarathi)]
    ),
    insurance: guide(
      pair('Vehicle insurance', 'વાહનનો વીમો'),
      [
        rc,
        pair(
          'Previous policy and expiry date for a renewal or insurer change.',
          'રિન્યુઅલ અથવા વીમા કંપની બદલવા માટે અગાઉની પોલિસી અને તેની સમાપ્તિ તારીખ.'
        ),
        pair(
          'Insurer-accepted identity/address documents or CKYC details.',
          'વીમા કંપની સ્વીકારતી ઓળખ/સરનામાના દસ્તાવેજો અથવા CKYC વિગતો.'
        ),
        pair(
          'Previous claims and no-claim bonus details, if applicable.',
          'લાગુ પડે તો અગાઉના ક્લેમ અને નો-ક્લેમ બોનસની વિગતો.'
        ),
        pair(
          'Purchase invoice for a new vehicle; inspection details if requested by the insurer.',
          'નવા વાહનનું ખરીદી બિલ; વીમા કંપની માગે તો તપાસની વિગતો.'
        )
      ],
      [source('UIIC — insurer KYC guidance', 'https://uiic.co.in/web/hi/kyc-process')],
      pair(
        'This is an insurance enquiry checklist. The selected insurer determines the final KYC, inspection and policy requirements.',
        'આ વીમાની પૂછપરછ માટેની યાદી છે. અંતિમ KYC, તપાસ અને પોલિસીની જરૂરિયાત પસંદ કરેલી વીમા કંપની નક્કી કરે છે.'
      )
    ),
    permits: guide(
      pair('Commercial vehicle permits', 'વ્યવસાયિક વાહનની પરમિટ'),
      [
        rc,
        insurance,
        puc,
        pair(
          'Fitness certificate and vehicle tax-payment records.',
          'ફિટનેસ પ્રમાણપત્ર અને વાહનનો ટેક્સ ભર્યાની રસીદો.'
        ),
        pair(
          'Existing permit/authorisation for a renewal, if issued.',
          'રિન્યુઅલ માટે હાલની પરમિટ/અધિકૃતતા, આપવામાં આવી હોય તો.'
        ),
        pair(
          'Owner/business identity and address details, vehicle category and intended route/states.',
          'માલિક/વ્યવસાયની ઓળખ અને સરનામાની વિગતો, વાહનનો પ્રકાર અને ઇચ્છિત રૂટ/રાજ્યો.'
        )
      ],
      [source('VAHAN — permit services', vahan)],
      pair(
        'A starting list only: goods, passenger, tourist and national permits have different requirements. Confirm the permit category before arranging forms.',
        'આ પ્રારંભિક યાદી છે: માલવાહક, મુસાફર, પ્રવાસી અને નેશનલ પરમિટની જરૂરિયાતો જુદી હોય છે. ફોર્મ તૈયાર કરતાં પહેલાં પરમિટનો પ્રકાર નક્કી કરો.'
      )
    ),
    'choice-number': guide(
      pair('Fancy / choice number', 'પસંદગીનો / ફેન્સી નંબર'),
      [
        identity,
        pair(
          'Vehicle/dealer application or temporary registration details, if already issued.',
          'વાહન/ડીલરની અરજી અથવા કામચલાઉ રજીસ્ટ્રેશનની વિગતો, મળી હોય તો.'
        ),
        pair(
          'Preferred numbers and the registration authority/state you are applying to.',
          'પસંદગીના નંબરો અને જે રજીસ્ટ્રેશન કચેરી/રાજ્યમાં અરજી કરવાની હોય તેની વિગતો.'
        ),
        pair(
          'Booking, payment or allotment acknowledgement, if already obtained.',
          'બુકિંગ, ચુકવણી અથવા ફાળવણીની પહોંચ, મળી હોય તો.'
        )
      ],
      [source('Parivahan — fancy number portal', 'https://fancy.parivahan.gov.in/')],
      pair(
        'Availability, auction rules and required documents depend on the state and number series. A preferred number is not guaranteed.',
        'ઉપલબ્ધતા, હરાજીના નિયમો અને જરૂરી દસ્તાવેજો રાજ્ય અને નંબરની શ્રેણી પર આધારિત છે. પસંદગીનો નંબર મળવાની ખાતરી નથી.'
      )
    ),
    consulting: guide(
      pair('Other RTO guidance', 'અન્ય RTO માર્ગદર્શન'),
      [
        pair(
          'A short description of the work or issue you need help with.',
          'તમને જે કામ કે સમસ્યામાં મદદ જોઈએ તેનું ટૂંકું વર્ણન.'
        ),
        pair(
          'Relevant RC or driving licence details, if applicable.',
          'લાગુ પડે તો સંબંધિત RC અથવા ડ્રાઇવિંગ લાયસન્સની વિગતો.'
        ),
        pair(
          'Any existing application acknowledgement, notice or official correspondence.',
          'હાલની અરજીની પહોંચ, નોટિસ અથવા સરકારી પત્રવ્યવહાર.'
        )
      ],
      [source('Parivahan — official service information', 'https://parivahan.gov.in/')],
      pair(
        'This is a consultation starter, not an application checklist. We will identify the exact service and its documents with you.',
        'આ સલાહ માટેની પ્રારંભિક યાદી છે, અરજીની અંતિમ યાદી નથી. અમે તમારી સાથે ચોક્કસ સેવા અને તેના દસ્તાવેજો નક્કી કરીશું.'
      )
    )
  };
  window.ShreenathServiceChecklists = {
    reviewed: '2026-10-11',
    guides,
    services: {
      registration: ['registration'],
      ownership: ['ownership'],
      licence: ['renewal', 'learner', 'permanent'],
      duplicate: ['duplicate-rc', 'duplicate-dl'],
      fitness: ['fitness'],
      noc: ['noc'],
      hypothecation: ['hypothecation'],
      address: ['address-rc', 'address-dl'],
      insurance: ['insurance'],
      permits: ['permits'],
      'choice-number': ['choice-number'],
      consulting: ['consulting']
    }
  };
})();
