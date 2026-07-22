const Auth = {
    session: null,
    profile: null,

    async init() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        this.session = session;
        if (session) {
            await this.loadProfile();
        }
        return session;
    },

    async login(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        this.session = data.session;
        await this.loadProfile();
        return data.session;
    },

    async loadProfile() {
        const user = this.getUser();
        if (!user) return;

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            this.profile = data;
        } else {
            const { data: allProfiles } = await supabaseClient
                .from('profiles')
                .select('id')
                .limit(1);
            const isFirstUser = !allProfiles || allProfiles.length === 0;
            const role = isFirstUser ? 'super_admin' : 'staff';
            const { data: newProfile, error: insertError } = await supabaseClient
                .from('profiles')
                .insert([{ id: user.id, email: this.getEmail(), role }])
                .select()
                .single();
            if (insertError) {
                const { data: retry } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                this.profile = retry;
            } else {
                this.profile = newProfile;
            }
        }
    },

    async logout() {
        try {
            await supabaseClient.auth.signOut();
        } catch (_) { }
        this.session = null;
        this.profile = null;
        window.location.href = 'pages/login.html';
    },

    getUser() {
        return this.session?.user ?? null;
    },

    getEmail() {
        return this.session?.user?.email ?? '';
    },

    isAuthenticated() {
        return !!this.session;
    },

    getRole() {
        return this.profile?.role || 'staff';
    },

    isSuperAdmin() {
        return this.getRole() === 'super_admin';
    }
};
