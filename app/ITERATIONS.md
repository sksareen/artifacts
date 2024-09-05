## Iteration 1

### What Went Well

- server is connected, server health checks run periodically
- server status indicator
- styling

### What Didn't Go Well

- I expected npm run dev to make the FE and BE start at teh same time but I still ahve to run node server.js in another terminal
- code is not generating. if it is it's not appearing at all
- app preview isn't working
- some issue with jbartifacts?
- the layout and style doens't look too impressive. let's make it more simple with the look and feel of tiktok

### Next Steps

- tell me how to monitor the API response in real time in console or elsewhere, because the error says it can't find jbartifact tags

---

## Aug 27, 2024

### What Went Well

- Styling is centered and responsive
- Server and API connections work as expected
-

### What Didn't

- Not rendering in app preview
- syntax confusion with the returned and cleaned code

---

## Aug 29 2024

This worked before, but no longer:

1. render app in browser
2. render artifact component in browser

the solution to both is actually the same. the hard part is rendering a component in a browser to take care of:

1. translation to JS - babel
2. managing dependencies - pre-install in the environment
3. use vercel? not required
4.

---

## Sep 3 2024

What am I building? Let's be super clear.

The main part of this is the scroller like interface. I want to see a library. I need to get WOWed by the discovery. I don't need people to make it in my platform yet, it's not good enough. So let's make a Scrolller inspired view. This means the main App page is an infinite scroll of all the apps linked in the table (or database?)

1. View all the apps available (static previews of websites, make them live previews on mouseover for 1+ seconds)
2. Click on the previews to open them
3. If they are Claude artifacts then they open as a unique URL, but appear as an overlay. this means that if I click 'esc' or the X in the top left then i return to the home page
