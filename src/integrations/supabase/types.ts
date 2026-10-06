export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_label: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          action: string
          actor_label?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_label?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          nav_label: string | null
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          nav_label?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          nav_label?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          id: string
          image_url: string | null
          kind: string
          page_id: string
          published: boolean
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          page_id: string
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          page_id?: string
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      com_catalog: {
        Row: {
          created_at: string
          designation: string
          famille: string | null
          id: string
          prix: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          famille?: string | null
          id?: string
          prix?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          famille?: string | null
          id?: string
          prix?: number
          updated_at?: string
        }
        Relationships: []
      }
      com_inventory: {
        Row: {
          created_at: string
          designation: string
          famille: string | null
          id: string
          quantite: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          famille?: string | null
          id?: string
          quantite?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          famille?: string | null
          id?: string
          quantite?: number
          updated_at?: string
        }
        Relationships: []
      }
      company: {
        Row: {
          core_logo_large_size: number
          core_logo_large_url: string | null
          core_logo_small_size: number
          core_logo_small_url: string | null
          created_at: string
          id: string
          login_logo_size: number
          login_logo_url: string | null
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          core_logo_large_size?: number
          core_logo_large_url?: string | null
          core_logo_small_size?: number
          core_logo_small_url?: string | null
          created_at?: string
          id?: string
          login_logo_size?: number
          login_logo_url?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          core_logo_large_size?: number
          core_logo_large_url?: string | null
          core_logo_small_size?: number
          core_logo_small_url?: string | null
          created_at?: string
          id?: string
          login_logo_size?: number
          login_logo_url?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_key: string
          page_slug: string
          updated_at: string
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_key: string
          page_slug: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_key?: string
          page_slug?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      content_texts: {
        Row: {
          created_at: string
          id: string
          page_slug: string
          style: Json
          text_key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_slug: string
          style?: Json
          text_key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_slug?: string
          style?: Json
          text_key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          details: string | null
          done: boolean
          due_at: string | null
          id: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          details?: string | null
          done?: boolean
          due_at?: string | null
          id?: string
          subject: string
          type?: string
          updated_at?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          details?: string | null
          done?: boolean
          due_at?: string | null
          id?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          city: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          owner_id: string | null
          phone: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_deals: {
        Row: {
          amount: number
          contact_id: string | null
          created_at: string
          currency: string
          expected_close: string | null
          id: string
          notes: string | null
          owner_id: string | null
          probability: number
          stage: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          probability?: number
          stage?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          probability?: number
          stage?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_products: {
        Row: {
          created_at: string
          id: string
          prix: number
          produit: string
          quantite: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prix?: number
          produit: string
          quantite?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prix?: number
          produit?: string
          quantite?: number
          updated_at?: string
        }
        Relationships: []
      }
      fin_accounts: {
        Row: {
          created_at: string
          currency: string
          id: string
          kind: string
          name: string
          opening_balance: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          name: string
          opening_balance?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          name?: string
          opening_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
      fin_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          label: string
          notes: string | null
          spent_on: string
          status: string
          supplier: string | null
          tax_rate: number
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          label: string
          notes?: string | null
          spent_on?: string
          status?: string
          supplier?: string | null
          tax_rate?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          label?: string
          notes?: string | null
          spent_on?: string
          status?: string
          supplier?: string | null
          tax_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      fin_invoice_lines: {
        Row: {
          created_at: string
          id: string
          invoice_id: string
          label: string
          quantity: number
          tax_rate: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id: string
          label: string
          quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string
          label?: string
          quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fin_invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "fin_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_invoices: {
        Row: {
          contact_id: string | null
          created_at: string
          currency: string
          direction: string
          due_date: string | null
          id: string
          issue_date: string
          notes: string | null
          number: string
          status: string
          subtotal: number
          tax_total: number
          total: number
          updated_at: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          currency?: string
          direction?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          number: string
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          currency?: string
          direction?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          number?: string
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      fin_transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          direction: string
          happened_on: string
          id: string
          invoice_id: string | null
          label: string
          method: string
        }
        Insert: {
          account_id?: string | null
          amount?: number
          created_at?: string
          direction?: string
          happened_on?: string
          id?: string
          invoice_id?: string | null
          label: string
          method?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          direction?: string
          happened_on?: string
          id?: string
          invoice_id?: string | null
          label?: string
          method?: string
        }
        Relationships: [
          {
            foreignKeyName: "fin_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fin_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fin_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "fin_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      module_connections: {
        Row: {
          configuration: Json
          connection_type: string
          created_at: string
          id: string
          permissions: Json
          source_module_id: string | null
          status: string
          target_module_id: string | null
          updated_at: string
        }
        Insert: {
          configuration?: Json
          connection_type?: string
          created_at?: string
          id?: string
          permissions?: Json
          source_module_id?: string | null
          status?: string
          target_module_id?: string | null
          updated_at?: string
        }
        Update: {
          configuration?: Json
          connection_type?: string
          created_at?: string
          id?: string
          permissions?: Json
          source_module_id?: string | null
          status?: string
          target_module_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_connections_source_module_id_fkey"
            columns: ["source_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_connections_target_module_id_fkey"
            columns: ["target_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_field_mappings: {
        Row: {
          cond_source_column: string | null
          cond_target_column: string | null
          created_at: string
          enabled: boolean
          id: string
          source_column: string
          source_module: string
          source_table: string
          target_column: string
          target_module: string
          target_table: string
          updated_at: string
        }
        Insert: {
          cond_source_column?: string | null
          cond_target_column?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          source_column: string
          source_module: string
          source_table: string
          target_column: string
          target_module: string
          target_table: string
          updated_at?: string
        }
        Update: {
          cond_source_column?: string | null
          cond_target_column?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          source_column?: string
          source_module?: string
          source_table?: string
          target_column?: string
          target_module?: string
          target_table?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_permissions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          module_id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          module_id: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          configuration: Json
          created_at: string
          description: string | null
          enabled: boolean
          icon: string
          id: string
          name: string
          parent_id: string | null
          route: string | null
          slug: string
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string
          id?: string
          name: string
          parent_id?: string | null
          route?: string | null
          slug: string
          status?: string
          updated_at?: string
          version?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          icon?: string
          id?: string
          name?: string
          parent_id?: string | null
          route?: string | null
          slug?: string
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_inbox: {
        Row: {
          body: string
          contact_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          source: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          contact_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          contact_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "msg_inbox_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string | null
          sender_label: string | null
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string | null
          sender_label?: string | null
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string | null
          sender_label?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "msg_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "msg_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_threads: {
        Row: {
          contact_id: string | null
          created_at: string
          created_by: string | null
          id: string
          kind: string
          last_message_at: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          last_message_at?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          last_message_at?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "msg_threads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          slug: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          group_name: string
          id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_type: string
          company_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_login_at: string | null
          last_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          access_type?: string
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_login_at?: string | null
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          access_type?: string
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label?: string | null
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          actor_id: string | null
          created_at: string
          event: string
          from_plan: string | null
          from_status: string | null
          id: string
          subscription_id: string
          to_plan: string | null
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event: string
          from_plan?: string | null
          from_status?: string | null
          id?: string
          subscription_id: string
          to_plan?: string | null
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event?: string
          from_plan?: string | null
          from_status?: string | null
          id?: string
          subscription_id?: string
          to_plan?: string | null
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          plan: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          plan: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          plan?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_module_access: {
        Row: {
          created_at: string
          id: string
          module_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_access_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_current_user: {
        Args: { _first_name?: string; _last_name?: string }
        Returns: undefined
      }
      can_see_module: {
        Args: { _module_id: string; _uid: string }
        Returns: boolean
      }
      check_access: { Args: never; Returns: Json }
      has_permission: {
        Args: { _code: string; _user_id: string }
        Returns: boolean
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      has_role_slug: {
        Args: { _slug: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
